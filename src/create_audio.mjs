/**
 * @fileOverview Provides functionalities for generating audio content from text and JSON data using OpenAI's APIs. 
 * 
 * This module contains functions for creating speech from text input, saving audio files, extracting text from JSON for speech synthesis, and converting JSON data to audio files in a specified directory. It leverages OpenAI's text-to-speech and GPT-4 models to process and convert textual content into spoken audio, supporting various customization options like voice model and speech speed. 
 * 
 * Functions exposed from [cli](module-Ipynb2web_cli.html) and [node](module-Ipynb2web_node.html).
 * @module create_audio
 * @exports {Object} - Exports functions like createSpeech, saveSpeech, getTextFromJson, and speechFromDir for audio processing and generation.
 * @author Charles Karpati
 */



import fs from "fs";
import path from 'path';

/**
 * Creates an audio speech from text using the OpenAI API.
 * 
 * @async
 * @public
 * @param {string} input - The text to be converted into speech.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {string} [voice='echo'] - The voice model to use.
 * @param {number} [speed=1.0] - The speed of the speech (0.25 to 4.0).
 * @param {string} [model='tts-1'] - The speech model to use.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Buffer|null} The audio data as a Buffer, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if fetching the speech fails and verbose is true.
 * @memberof module:create_audio
 */
async function createSpeech(input, apikey, voice = 'echo', speed = 1.0, model = 'tts-1', verbose = false) {
    if (!apikey) { apikey = process.env.OPENAI_API_KEY }
    if (!apikey) { verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.'); return }
    try {
        const openai = new OpenAI(apikey);
        // Speed [ `0.25` - `4.0`]. default = `1.0`. 
        // The maximum length is 4096 characters.
        const mp3Response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model, input, voice, speed, response_format: 'mp3'
            })
        });
        var buffer = await mp3Response.buffer();
    } catch (e) {
        verbose && console.log('createSpeech error', e)
        return
    }
    return buffer
}

/**
 * Saves the given audio buffer to a file.
 *
 * @async
 * @param {string} mp3SaveFilePath - The file path where the MP3 should be saved.
 * @param {Buffer} buffer - The audio data to be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; saves the audio buffer to a file.
 * @throws {Error} Logs an error to the console if there is a failure in saving the audio file and verbose is true.
 * @memberof module:create_audio
 */
async function saveSpeech(mp3SaveFilePath, buffer, verbose = false) {
    try {
        await fs.promises.writeFile(mp3SaveFilePath, buffer);
        verbose && console.log(`Audio saved to ${mp3SaveFilePath}`);
    } catch (e) {
        verbose && console.log('saveSpeech error', e)
    }
}

/**
 * Pass json to chatGPT and ask it to extract the text for speech using gpt4.
 *
 * @async
 * @param {Object} json - The JSON object containing the data to extract text from.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {string} [model='gpt-4o-mini'] - The text model to use.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string|null} The extracted text from the JSON object, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if there is an error in fetching or processing the request and verbose is true.
 * @memberof module:create_audio
 */

async function getTextFromJson(json, apikey, model='gpt-4o-mini', verbose = false) {
    if (!apikey) { apikey = process.env.OPENAI_API_KEY; }
    if (!apikey) { verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.'); return }
    try {
        let text = !json.title ? '' : `Title:   ${json.title} \n `;
        text += !json.summary ? '' : `Summary: ${json.summary} \n `;
        text += `Content: ${JSON.stringify(json.content)}`;

        const requestBody = {
            model,
            messages: [
                {
                    "role": "system", "content": `
You are an assistant to a webpage to audio service. 
You will be given a webpage you must convert it to a form of text ready for reading aloud.
Start every conversion with a statement "You are listening to the audio version of this webpage" followed by the title and summary.
Under no circumstances should code be read and should be paraphrased or skipped. 
`
                },
                { "role": "user", "content": text }
            ]
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        let data
        const responseData = await response.json();
        data = responseData.choices[0].message.content;
    } catch (e) {
        verbose && console.log('getTextFromJson error', e)
        return
    }
    return data;
}

/**
 * Converts all JSON files in a directory to speech files.
 * Recursively processes directories and skips non-JSON files.
 *
 * @async
 * @param {string} fromFolder - The directory containing JSON files.
 * @param {string} toFolder - The directory where the resulting MP3 files will be saved.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes files in place.
 * @throws {Error} Logs an error to the console if there is a failure in reading the directory or processing files and verbose is true.
 * @memberof module:create_audio
 */

async function speechFromDir(fromFolder, toFolder, apikey, verbose = false) {
    if (!apikey) { apikey = process.env.OPENAI_API_KEY }
    if (!apikey) { verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.'); return }
    // get all files in SAVETO.
    try {
        const files = fs.readdirSync(fromFolder);
        for (let i = 0; i < files.length; i++) {
            const filename = path.join(fromFolder, files[i]);
            const stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                speechFromDir(filename, toFolder); //recurse
            } else if (filename.indexOf('.json') >= 0) {
                let file = fs.readFileSync(filename, 'utf8');
                let json = JSON.parse(file);
                if (json?.meta?.audio) {
                    let text = await getTextFromJson(json);
                    let buffer = await createSpeech(text, apikey);
                    let file = files[i].substring(0, files[i].length - 5)
                    // console.log('file', file)
                    let savePath = path.join(toFolder, file) + '.mp3'
                    // console.log('savePath', savePath)
                    saveSpeech(savePath, buffer)
                }
            }
        }
    }
    catch (e) {
        verbose && console.log('speechFromDir error', e)
        return
    }
}

export { createSpeech, saveSpeech, getTextFromJson, speechFromDir }