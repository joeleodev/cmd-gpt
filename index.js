import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import readlineSync from "readline-sync";
import colors from "colors";

// put your api key inside .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
  });

async function HAL() {

    const userName = readlineSync.question("What is your name? ".green);
    const capUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
    console.log("");  // empty line for spacing
    console.log(`Welcome ${capUserName}! I'm your chatbot.\n`.green);
    console.log(`What do you need to know?`.green + "\n");

    // store entire chat history session here
    const chatHistory = []; 

    while (true) {
        const userInput = readlineSync.question("You: ".yellow);
        
        try {
            // add user message to chat history
            chatHistory.push({role: "user", content: userInput});
            
            // this bit sends the entire chat history array to openAI
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: chatHistory,
            });
            
            // add bot message to chat history
            const botResponse = chatCompletion.choices[0].message.content;
            chatHistory.push({role: "assistant", content: botResponse});
            
            console.log("Bot: ".blue + botResponse.green);

            // user can type exit to end chat or ctrl+c like normal
            if (userInput.toLowerCase() === 'exit') {
                console.log("Exiting, as you command.".green);
                process.exit();
            }
        } catch (error) {
            console.error("Error:", colors.red(error));
        }
    }
}

HAL();