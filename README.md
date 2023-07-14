# README

## steps to get this up and running:
- install asdf (for ruby and node)
- install ruby 3.2.2
- install node 19.7
- install yarn
- run a yarn install
- run a bundle install
- check to make sure tests pass
  - `yarn test` for the js tests
  - `rspec` for the backend tests

You can run the server locally and include the necessary env vars with something like this:

OPENAI_API_KEY='YOUR_KEY' \
RESEMBLE_VOICE_UUID='YOUR_UUID' \
RESEMBLE_PROJECT_UUID='YOUR_UUID' \
RESEMBLE_API_KEY='YOUR_KEY' \
LOCAL_DATA_FILENAME="some-pdf.pdf.output.csv" \
bin/rails server

You can run the frontend with something like this:

yarn build --watch

Or you can run them both via foreman like do:

OPENAI_API_KEY='YOUR_KEY' \
RESEMBLE_VOICE_UUID='YOUR_UUID' \
RESEMBLE_PROJECT_UUID='YOUR_UUID' \
RESEMBLE_API_KEY='YOUR_KEY' \
LOCAL_DATA_FILENAME="some-pdf.pdf.output.csv" \
foreman start -f Procfile.dev

This is the command to run the pdf_to_pages_embeddings script:
OPENAI_API_KEY='sk-YOUR-KEY' ./bin/pdf_to_pages_embeddings -p some-filename.pdf