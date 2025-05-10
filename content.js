let isFloatingWindowOpen = false;

document.addEventListener('mouseup',(e)=>{
	if (isFloatingWindowOpen){
		return;
	}
	if (e.detail > 1) return;

	const selection = window.getSelection().toString().trim();
	if (selection.length > 0){
		createFloatingWindow(e.clientX,e.clientY,selection);
	}
});

function createFloatingWindow(mouseX, mouseY, selection){
	isFloatingWindowOpen = true;

	const floatingWindow = document.createElement('div');
	floatingWindow.className = 'floating-window';
	
	floatingWindow.style.left = `${mouseX+10}px`;
	floatingWindow.style.top = `${mouseY+10}px`;

	const textarea = document.createElement('textarea');
	floatingWindow.appendChild(textarea);

	const buttonGroup = document.createElement('div');
	buttonGroup.className = 'button-group';

	const sendButton = document.createElement('button');
	sendButton.className = 'send-button'
	sendButton.textContent = 'send';

	sendButton.addEventListener('click', function() {
		const input = textarea.value;
		chrome.runtime.sendMessage({
		topic: 'askOpenAI',
		userSelection: selection,
		userInput: input
		});
		
		// // 提取补全内容
		// const completionContent = response.OpenAIResponse.choices[0]?.message?.content;

		// // 打印结果
		// if (completionContent) {
		// console.log('AI 返回内容：\n', completionContent);
		// } else {
		// console.log('未找到补全内容');
		// }

		// // 如果要打印整个 response 中的补全内容（含 markdown 格式）：
		// console.log('完整补全内容：\n---\n' + completionContent + '\n---');
		floatingWindow.remove();
		isFloatingWindowOpen = false;
	});

	const cancelButton = document.createElement('button');
	cancelButton.className = 'cancel-button';
	cancelButton.textContent = 'cancel';

	cancelButton.addEventListener('click', function (){
		floatingWindow.remove();
		isFloatingWindowOpen = false;
	});

	buttonGroup.appendChild(sendButton);
	buttonGroup.appendChild(cancelButton);

	floatingWindow.appendChild(buttonGroup);
	document.body.appendChild(floatingWindow);

	textarea.focus();
}