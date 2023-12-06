#!sh

# https://github.com/develar/app-builder/issues/63#issuecomment-914324662
echo Fixing hash bang for pnpm.cjs...
echo ""

pnpmPath=$(where pnpm | sed -n 1p)
path=$(dirname "$pnpmPath")
file="$path\\node_modules\\pnpm\\bin\\pnpm.cjs"

oldLine=$(cat "$file" | sed -n 1p)
newLine="#!node"

echo Replacing line \"1: "$oldLine"\" of \""$file"\" with \"1: "$newLine"\"
echo ""
sed -i "1s/.*/$newLine/" "$file"

echo Replaced \"1: "$oldLine"\" with \"1: "$newLine"\" at \""$file"\" 
