rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Compiles assets for Github pages"
git push -u origin master

