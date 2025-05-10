
const OPENAI_API_KEY = 'sk-157d911cf87b4412b3486f3bfa1a29e7';

async function callOpenAI(selection, input) {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `You are a helpful assistant. You are going to summarize the input: ${input}` },
          { role: "user", content: selection }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API failed request: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('callOpenAI error:', error);
    throw error; 
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.topic === 'askOpenAI') {
    console.log('from floating window:', request);

    callOpenAI(request.userSelection, request.userInput)
      .then(data => {
        const aidata = data.choices[0]?.message?.content;
        if (aidata !== undefined){
          // chrome.runtime.sendMessage(
          //   {topic:"showUpinPopup",
          //     aiAnswer:aidata
          //   }
          // );
          chrome.storage.local.set({aiAnswer:aidata})
        }
        // sendResponse({'OpenAIResponse':data}); 
      })
      .catch(error => {
        console.error('APIError:', error);
        sendResponse({ error: error.message }); 
      });

    return true; 
  }
  return false;
});