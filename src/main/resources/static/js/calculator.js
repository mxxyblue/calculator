/** calculator.js */
const OPERATOR = ['+', '-', '*', '/'];

function setCalculation(text) {
	let displayValue = document.querySelector('#inputNum').value;

	displayValue = inputNotEmptyProcess(displayValue, text); //계산식 처리

	if (text === 'C') {
		displayValue = ""; //계산식 초기화
	}

	document.querySelector('#inputNum').value = displayValue;
}

function calculate() {
	let displayValue = document.querySelector('#inputNum').value;

	if (displayValue === "") {
		inputEmptyCalculate(); // 계산식이 비어있는데 =을 입력했을 경우 0 출력
	}
	else {
		displayValue = inputNotEmptyCalculate(displayValue);
		document.querySelector('#inputNum').value = displayValue;
	}
}

function inputNotEmptyProcess(displayValue, text) {
	if (displayValue === "0" && text === "0") {
		displayValue = "0"; //계산식이 0인 상태에서 0을 계속 입력할 경우
	}
	else if (displayValue === "0" && text != "0" && !OPERATOR.includes(text)) {
		displayValue = text; //계산식이 0이면서 일반 숫자를 입력한 경우 0을 삭제하고 숫자를 출력
	}
	else { //계산식이 존재할 경우
		displayValue = operatorProcess(displayValue, text); //연산자 처리
		displayValue += text; //기존 계산식에 새로운 문자 더함
	}
	return displayValue;
}

function operatorProcess(displayValue, text) {
	let last = displayValue.slice(-1);
	let preLast = displayValue.slice(-2, -1);

	if (OPERATOR.includes(last) && OPERATOR.includes(text)) { //가장 마지막에 입력한 문자와 새로 입력한 문자가 연산자인지 체크
		displayValue = displayValue.slice(0, displayValue.length - 1); //연산자를 다시 입력했을 경우 이전 연산자를 제거하고 새로운 연산자로 대체
	}

	if (last === 0 && OPERATOR.includes(preLast)) {   //마지막에 입력한 값이 숫자 0이면서 이전 값이 연산자인 경우 ex) 25 + 0
		displayValue = displayValue.slice(0, displayValue.length - 1);
	}
	return displayValue;
}

function inputEmptyCalculate() { //계산식이 비어있을 경우 계산
	document.querySelector('#inputNum').value = 0;
}

function inputNotEmptyCalculate(displayValue) { //계산식이 비어있지 않을 경우 계산
	let chk = displayValue.slice(-1);

	if (OPERATOR.includes(chk)){
		displayValue = displayValue.slice(0, displayValue.length - 1); //마지막에 입력한 값이 연산자일 경우 해당 연산자를 제외하고 계산
	}
	
	let splitDisplayVal = splitDisplayValue(displayValue); //연산식 배열 처리
	let numArr = splitDisplayVal[0]; //숫자 배열
	let opArr = splitDisplayVal[1]; //연산자 배열

	let calResult = calculateMultiplyAndDivide(numArr, opArr); //곱하기, 나누기 연산
	numArr = calResult[0];
	opArr = calResult[1];
	let tmpArr = calResult[2];
	
	calResult = deleteUsedCalculation(numArr, opArr, tmpArr); //사용한 계산식 삭제
	numArr = calResult[0];
	opArr = calResult[1];
	
	numArr = calculatePlusAndMinus(numArr, opArr); //더하기, 빼기 연산
	return numArr.pop(); //가장 마지막 값을 결과값으로 출력
}

function splitDisplayValue(displayValue){ //계산식 배열 처리
	let arr = displayValue.split('');
		let numArr = []; //숫자 배열
		let opArr = []; //연산자 배열
		let tmp = "";
		
		for (let i = 0; i < arr.length; i++) {
			let a = arr[i];
			if (!OPERATOR.includes(a)) {  //피연산자일 경우 문자열 합침
				tmp += a;
			}
			else {
				numArr.push(Number(tmp)); //연산자일 경우 합친 문자열을 숫자 배열로 집어넣고
				tmp = "";
				opArr.push(a); //연산자도 순서대로 넣는다
			}
		}
		if (tmp != ""){
			numArr.push(Number(tmp)); //마지막 숫자 push
		}
	return [numArr, opArr];
}

function calculateMultiplyAndDivide(numArr, opArr){
	let tmpArr = [];
	let result = 0;
	let size = opArr.length;
	
	for (let i = 0; i < size; i++) { //연산자 배열의 크기만큼
		let oper = opArr[i];

		if (oper === '*' || oper === '/') { //곱셈 , 나눗셈 연산을 우선적으로 수행
			tmpArr.push(i);
			let operand1 = numArr[i];
			let operand2 = numArr[i + 1];

			if (oper === '*')
				result = operand1 * operand2;
			else if (oper === '/')
				result = operand1 / operand2; //연산

			numArr[i + 1] = result; //새롭게 계산한 값은 계산한 위치에 넣어두고
		}
	}
	return [numArr, opArr, tmpArr];
}

function deleteUsedCalculation(numArr, opArr, tmpArr){
	let tmpSize = tmpArr.length;

	for (let i = 0; i < tmpSize; i++) {
		let idx = tmpArr.pop(); //수정된 배열 길이의 영향을 받지 않도록 뒷 index부터 가져옴
		numArr.splice(idx, 1); //사용한 피연산자 삭제 
		opArr.splice(idx, 1); //사용한 연산자 삭제
	}
	return [numArr, opArr];
}

function calculatePlusAndMinus(numArr, opArr){
	let size = opArr.length; //곱셈, 나눗셈을 제외한 연산자 배열의 길이만큼
	let result = 0;
	
	for (let i = 0; i < size; i++) {
		let oper = opArr[i];
		let operand1 = numArr[i];
		let operand2 = numArr[i + 1];
		if (oper === '+')
			result = operand1 + operand2;
		else if (oper === '-')
			result = operand1 - operand2;
		numArr[i + 1] = result;
	}
	return numArr;
}