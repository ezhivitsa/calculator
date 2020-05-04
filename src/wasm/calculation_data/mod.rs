use std::str::FromStr;
use std::f64::consts::PI;
use std::f64::consts::E;

use std::rc::Rc;
use std::cell::RefCell;

use phf::phf_map;

pub mod node;
pub use node::{MathOperation, Modifier};
use node::{Node, Value};

use wasm_bindgen::prelude::*;

static MATH_CONSTANTS_MAP: phf::Map<&'static str, f64> = phf_map! {
  "pi" => PI,
  "e" => E,
};

fn parse_float(value: &str) -> f64 {
  let constant_value = MATH_CONSTANTS_MAP.get(value);
  match constant_value {
    Some(val) => {
      val.clone()
    },
    None => {
      let result = f64::from_str(value);
      match result {
          Ok(num) => {
              num
          }
          Err(_err) => {
              panic!("Unable to convert {} into number", value)
          }
      }
    }
  }
}

#[wasm_bindgen]
pub struct CalculationData {
  expression: Rc<RefCell<Node>>,
  expressions_stack: Vec<Rc<RefCell<Node>>>
}

#[wasm_bindgen]
impl CalculationData {
  pub fn new() -> CalculationData {
    let expression = Node::new();
    let expression_ref = Rc::new(RefCell::new(expression));

    let expressions_stack = vec![expression_ref.clone()];

    CalculationData {
      expression: expression_ref,
      expressions_stack
    }
  }

  pub fn set_value(&mut self, value: &str) {
    let value_num = parse_float(value);

    let mut expression = self.expression.borrow_mut();
    expression.set_value(Value::Float(value_num));
  }

  fn set_non_priority_operation(&mut self, operation: MathOperation) {
    let right = self.set_priority_operation(operation);
    self.expressions_stack.push(right);
  }

  fn set_priority_operation(&mut self, operation: MathOperation) -> Rc<RefCell<Node>> {
    let root_expression = self.expressions_stack.last().unwrap();
    let mut expression = root_expression.borrow_mut();

    let left = expression.clone();
    let right = Rc::new(RefCell::new(Node::new()));

    expression.set_value(Value::Operation(operation));
    expression.set_left(Rc::new(RefCell::new(left)));
    expression.set_right(right.clone());

    self.expression = right.clone();
    right.clone()
  }

  pub fn set_operation(&mut self, operation: MathOperation) {
    match operation {
      MathOperation::Divide | MathOperation::Multiply => {
        self.set_priority_operation(operation);
      }

      _ => {
        self.set_non_priority_operation(operation);
      }
    }
  }

  fn should_add_multiply_before_parentheses(&self) -> bool {
    let current_expression = self.expression.clone();
    let expression = current_expression.borrow();
    expression.should_add_multiply_before_parentheses()
  }

  fn prepare_to_add_constant(&mut self) {
    let should_add_operation = {
      let expression = self.expression.borrow();
      expression.has_value()
    };

    if should_add_operation {
      self.set_operation(MathOperation::Multiply);
    }
  }

  pub fn add_left_parentheses(&mut self) {
    let should_add_multiply = self.should_add_multiply_before_parentheses();
    if should_add_multiply {
        self.set_operation(MathOperation::Multiply);
    }

    let current_expression = self.expression.clone();
    self.expressions_stack.push(current_expression.clone());
  }

  pub fn add_right_parentheses(&mut self) {
    self.expressions_stack.pop();
    let root_expression = self.expressions_stack.pop().unwrap();
    self.expression = root_expression.clone();
  }

  pub fn add_constant(&mut self, value: &str) {
    self.prepare_to_add_constant();
    self.set_value(value);
  }

  pub fn calculate(&self) -> String {
    let expression = self.expressions_stack.first().unwrap().borrow();
    let result = expression.get_value();
    result.to_string()
  }

  pub fn validate(&self) -> bool {
    let expression = self.expressions_stack.first().unwrap().borrow();
    expression.validate()
  }

  pub fn clean(&mut self) {
    let expression = Rc::new(RefCell::new(Node::new()));

    self.expressions_stack.clear();

    self.expression = expression.clone();
    self.expressions_stack.push(expression.clone());
  }

  pub fn add_prefix_modifier(&mut self, modifier: Modifier) {
    self.prepare_to_add_constant();

    let left = {
      let mut expression = self.expression.borrow_mut();
      expression.set_value(Value::Modifier(modifier));
  
      self.expressions_stack.push(self.expression.clone());
  
      let left = Rc::new(RefCell::new(Node::new()));
      expression.set_left(left.clone());
  
      self.expressions_stack.push(left.clone());
      left.clone()
    };
    self.expression = left;
  }
}
