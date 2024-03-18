# bun fun

Playing with HTMX and bun. Using Elysia as a server framework.

Got the basic to do list up and functioning. Going to now experiment with picovoice api.

## picovoice

The goal is to extend (probably gut existing work but we will see...) the application with the capability to upload audio files (specifically .m4a and .mp3 formats), send these files to the backend, process them using the Picovoice Leopard API for speech-to-text transcription, and display the transcription results.

I chose picovoice because a few reasons:

1. They are currently hiring and I wanted to be able to actually offer some value in my cover letter
2. From my understand at this moment, I download the model, and so I can use it offline and in a private manner
3. The privacy is big, because I like thinking out loud and writing always feels like I am contained in some manner. So I would like to use this app as a dictation tool.

ok... lets do this

## update

So... it seems like picovoice node api may not jive with bun.

I was under the impression that Bun allowed just plug and play with the npm...

Will have to look into this further. Bummer.
