import fs from 'fs';

import { sleep } from '@cypherock/cysync-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGoogleAPIKey = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Missing GOOGLE_API_KEY');
  }

  return process.env.GOOGLE_API_KEY;
};

const genAI = new GoogleGenerativeAI(getGoogleAPIKey());

export const createJsonChunks = (json: object) => {
  const chunks = [];

  for (const [key, value] of Object.entries(json)) {
    chunks.push({ [key]: value });
  }

  return chunks;
};

const getGoogleResponse = async (
  json: object,
  lang: string,
  options?: { dontTranslatePhrases: string[] },
) => {
  let result: any;
  const maxRetries = 3;
  let retry = 0;
  let isSuccessful = false;

  while (!isSuccessful && retry < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are a helpful assistant designed to output JSON.
          You task is to translate JSON files into different languages.
          Do not modify the JSON keys, only translate the JSON values.
          Make sure to not change the JSON structure or JSON types.
          Do not convert number or boolean type values.
          Do not modify any links.
          Do not modify the HTML tags if found, only translate the text inside the HTML tag.
          Do not translate any phrases that are in the list of phrases provided in the input as comma separated strings in \`Dont Translate\`.
          The input will be in the format of \`Language Code={lang}\nDont Translate={dontTranslatePhrases}\n {json}\n\`
          The output format should be in JSON \`{json}\``,
      });

      result = await model.generateContent(
        `Language Code=${lang}\nDont Translate=${(
          options?.dontTranslatePhrases ?? []
        ).join(',')}\n ${JSON.stringify(json, undefined, 2)}`,
      );

      isSuccessful = true;
    } catch (error) {
      if (retry < maxRetries) {
        retry += 1;
        console.log(`Retrying... (${retry}/${maxRetries})`);
        await sleep(3000);
      } else {
        throw error;
      }
    }
  }

  if (!isSuccessful) {
    throw new Error('Failed to generate content');
  }

  let response = result.response.text().trim();
  const responseArr = response.split('\n');
  if (responseArr[0].includes('```json')) {
    responseArr[0] = '';
  }
  if (responseArr[responseArr.length - 1].includes('```')) {
    responseArr[responseArr.length - 1] = '';
  }
  response = responseArr.join('\n');

  try {
    return JSON.parse(response);
  } catch (error) {
    await fs.promises.writeFile('error.txt', result.response.text());
    throw error;
  }
};

export const translateLangWithGoogle = async (
  json: object,
  lang: string,
  options?: { dontTranslatePhrases: string[] },
) => {
  const maxConcurrency = 1;
  let activePromises: Promise<any>[] = [];
  let result = {};

  const inputs = createJsonChunks(json);

  for (const input of inputs) {
    // eslint-disable-next-line no-loop-func
    const promise = getGoogleResponse(input, lang, options).finally(() => {
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
      await sleep(6000);
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
