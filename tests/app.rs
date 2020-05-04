use wasm_bindgen_test::{wasm_bindgen_test_configure};

// mod calculation_data;
wasm_bindgen_test_configure!(run_in_browser);

extern crate calculator;
use calculator::calculation_data::{CalculationData, MathOperation, Modifier};

#[test]
fn should_calculate_sum_of_numbers() {
  let mut calculation_data = CalculationData::new();

  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Plus);
  calculation_data.set_value(&"4");
  
  // 5 + 4 == 9
  assert_eq!(calculation_data.calculate(), "9");
}

#[test]
fn should_calculate_expression_with_several_divides() {
  let mut calculation_data = CalculationData::new();

  calculation_data.set_value(&"1");
  calculation_data.set_operation(MathOperation::Plus);
  calculation_data.set_value(&"10");
  calculation_data.set_operation(MathOperation::Divide);
  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Divide);
  calculation_data.set_value(&"2");
  calculation_data.set_operation(MathOperation::Minus);
  calculation_data.set_value(&"3");

  // 1 + 10 / 5 / 2 - 3 == -1
  assert_eq!(calculation_data.calculate(), "-1");
}

#[test]
fn should_calculate_expression_with_parentheses() {
  let mut calculation_data = CalculationData::new();

  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Divide);
  calculation_data.add_left_parentheses();
  calculation_data.set_value(&"7");
  calculation_data.set_operation(MathOperation::Minus);
  calculation_data.set_value(&"9");
  calculation_data.add_right_parentheses();
  calculation_data.set_operation(MathOperation::Multiply);
  calculation_data.set_value(&"2");
  
  // 5 ÷ (7 − 9) × 2 = -5
  assert_eq!(calculation_data.calculate(), "-5");
}

#[test]
fn should_calculate_complex_expression() {
  let mut calculation_data = CalculationData::new();

  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Plus);
  calculation_data.set_value(&"4");
  calculation_data.set_operation(MathOperation::Multiply);
  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Divide);

  calculation_data.add_left_parentheses();
  calculation_data.set_value(&"7");
  calculation_data.set_operation(MathOperation::Minus);
  calculation_data.set_value(&"9");
  calculation_data.add_right_parentheses();

  calculation_data.set_operation(MathOperation::Multiply);

  calculation_data.add_left_parentheses();
  calculation_data.set_value(&"8");
  calculation_data.set_operation(MathOperation::Minus);
  calculation_data.set_value(&"5");
  calculation_data.set_operation(MathOperation::Multiply);
  calculation_data.set_value(&"4");
  calculation_data.add_right_parentheses();

  calculation_data.set_operation(MathOperation::Minus);
  calculation_data.set_value(&"2");

  // 5 + 4 × 5 ÷ (7 − 9) × (8 − 5 × 4) − 2 = 123
  assert_eq!(calculation_data.calculate(), "123");
}

#[test]
fn should_calculate_expression_with_modifiers() {
  let mut calculation_data = CalculationData::new();

  calculation_data.set_value(&"1");
  calculation_data.set_operation(MathOperation::Plus);

  calculation_data.add_prefix_modifier(Modifier::Sin);
  calculation_data.add_constant("pi");
  calculation_data.set_operation(MathOperation::Divide);
  calculation_data.add_constant("2");
  calculation_data.add_right_parentheses();

  calculation_data.set_operation(MathOperation::Minus);

  calculation_data.add_prefix_modifier(Modifier::Ln);
  calculation_data.add_constant("e");
  calculation_data.add_right_parentheses();

  // 1 + sin(pi / 2) - ln(e) == 1
  assert_eq!(calculation_data.calculate(), "1");
}
