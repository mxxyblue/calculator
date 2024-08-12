package calculator.com.calculator.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class CalController {
	
	/**
	 * 계산기 화면 출력
	 * @return
	 */
	@RequestMapping(value = "/calculator", method = RequestMethod.GET)
	public String goCalculator() {
		return "calculator";
	}
}
