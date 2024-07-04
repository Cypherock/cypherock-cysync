import fs from 'fs';

import OpenAI from 'openai';

const getOpenAPIKey = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  return process.env.OPENAI_API_KEY;
};

const openai = new OpenAI({ apiKey: getOpenAPIKey() });

export const createJsonChunks = (json: object) => {
  const chunks = [];

  for (const [key, value] of Object.entries(json)) {
    chunks.push({ [key]: value });
  }

  return chunks;
};

const getOpenAIResponse = async (
  json: object,
  lang: string,
  options?: { dontTranslatePhrases: string[] },
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant designed to output JSON.
          You task is to translate JSON files into different languages.
          Do not modify the JSON keys, only translate the JSON values.
          Make sure to not change the JSON structure or JSON types.
          Do not convert number or boolean type values.
          Do not modify any links.
          Do not modify the HTML tags if found, only translate the text inside the HTML tag.
          Do not translate any phrases that are in the list of phrases provided in the input as \`Dont Translate\`
          The input will be in the format of \`Language Code={lang}\nDont Translate={dontTranslatePhrases}\n {json}\n\` `,
      },
      {
        role: 'user',
        content: `Language Code=${lang}\nDont Translate=${(
          options?.dontTranslatePhrases ?? []
        ).join(',')}\n ${JSON.stringify(json, undefined, 2)}`,
      },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  });

  const response = (completion.choices[0].message.content ?? '').trim();

  try {
    return JSON.parse(response);
  } catch (error) {
    await fs.promises.writeFile(
      'error.txt',
      completion.choices[0].message.content ?? '',
    );
    throw error;
  }
};

export const translateLangWithOpenAI = async (
  json: object,
  lang: string,
  options?: { dontTranslatePhrases: string[] },
) => {
  const maxConcurrency = 10;
  let activePromises: Promise<any>[] = [];
  let result = {};

  const inputs = createJsonChunks(json);

  for (const input of inputs) {
    // eslint-disable-next-line no-loop-func
    const promise = getOpenAIResponse(input, lang, options).finally(() => {
      activePromises = activePromises.filter(p => p !== promise);
    });
    activePromises.push(promise);

    // If the number of active promises reaches maxConcurrency, wait for any of them to complete
    if (activePromises.length >= maxConcurrency) {
      const response = await Promise.race(activePromises);
      result = {
        ...result,
        ...response,
      };
    }
  }

  const promises = await Promise.all(activePromises);

  for (const response of promises) {
    result = {
      ...result,
      ...response,
    };
  }

  return result;
};
