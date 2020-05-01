use std::str::FromStr;
use std::f64::consts::PI;
use std::f64::consts::E;

use std::rc::Rc;
use std::cell::RefCell;

use phf::phf_map;

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

enum MathOperation {
  Divide,
  Multiply,
  Minus,
  Plus,
}

fn apply_operation(value1: &f64, value2: &f64, operation: &MathOperation) -> f64 {
  match operation {
    MathOperation::Divide => {
      value1 / value2
    },

    MathOperation::Multiply => {
      value1 * value2
    },

    MathOperation::Minus => {
      value1 - value2
    },

    MathOperation::Plus => {
      value1 + value2
    }
  }
}

enum Value {
  None,
  Float(f64),
  Operation(MathOperation)
}

struct Node {
  value: Value,
  left: Option<Rc<RefCell<Node>>>,
  right: Option<Rc<RefCell<Node>>>,
}

impl Node {
  fn new() -> Node {
    Node {
      value: Value::None,
      left: None,
      right: None
    }
  }

  fn set_value(&mut self, value: Value) {
    self.value = value;
  }

  fn set_operation(&mut self, operation: MathOperation) {
    self.value = Value::Operation(operation);
  }

  fn get_value(&self) -> f64 {
    match &self.value {
      Value::Float(value) => {
        *value
      },

      Value::Operation(operation) => {
        let left_value = match &self.left {
          Some(node) => {
            node.borrow().get_value()
          },
          None => {
            panic!("Error when get left_value");
          }
        };

        let right_value = match &self.right {
          Some(node) => {
            node.borrow().get_value()
          },
          None => {
            panic!("Error when get right_value");
          }
        };

        apply_operation(&left_value, &right_value, operation)
      },

      Value::None => {
        match &self.left {
          Some(node) => {
            node.borrow().get_value()
          },
          None => {
            panic!("Error when get left value for node with Node value");
          }
        }
      }
    }
  }

  pub fn copy_operation(operation: &MathOperation) -> MathOperation {
    match operation {
      MathOperation::Divide => MathOperation::Divide,
      MathOperation::Multiply => MathOperation::Multiply,
      MathOperation::Minus => MathOperation::Minus,
      MathOperation::Plus => MathOperation::Plus,
    }
  }

  pub fn copy_value(&self) -> Value {
    match &self.value {
      Value::None => Value::None,
      Value::Float(val) => Value::Float(*val),
      Value::Operation(operation) => Value::Operation(Node::copy_operation(operation))
    }
  }
}

struct CalculationData {
  expression: Rc<RefCell<Node>>,
  expressions_stack: Vec<Rc<RefCell<Node>>>
}

impl CalculationData {
  fn new() -> CalculationData {
    let expression = Node::new();
    let expression_ref = Rc::new(RefCell::new(expression));

    let expressions_stack = vec![expression_ref.clone()];

    CalculationData {
      expression: expression_ref,
      expressions_stack
    }
  }

  fn set_value(&mut self, value: &str) {
    let value_num = parse_float(value);

    let mut expression = self.expression.borrow_mut();

    match &expression.left {
      Some(node) => {
        node.borrow_mut().set_value(Value::Float(value_num));
      },
      None => {
        let mut left = Node::new();
        left.set_value(Value::Float(value_num));

        expression.left = Some(Rc::new(RefCell::new(left)));
      }
    }
  }

  fn set_priority_operation(&mut self, operation: MathOperation) {
    let current_expression = self.expression.clone();
    let mut expression = current_expression.borrow_mut();
    
    expression.set_operation(operation);

    let right = Rc::new(RefCell::new(Node::new()));
    expression.right = Some(right.clone());

    self.expression = right.clone();
  }

  fn set_non_priority_operation(&mut self, operation: MathOperation) {
    let root_expression = self.expressions_stack.last().unwrap();
    let mut expression = root_expression.borrow_mut();

    let left = Node {
      value: expression.copy_value(),
      left: expression.left.clone(),
      right: expression.right.clone()
    };

    let right = Rc::new(RefCell::new(Node::new()));

    expression.value = Value::Operation(operation);
    expression.left = Some(Rc::new(RefCell::new(left)));
    expression.right = Some(right.clone());

    self.expression = right.clone();
  }

  fn set_operation(&mut self, operation: MathOperation) {
    match operation {
      MathOperation::Divide | MathOperation::Multiply => {
        self.set_priority_operation(operation);
      }

      _ => {
        self.set_non_priority_operation(operation);
      }
    }
  }

  fn should_add_multiply_before_parentheses(&mut self) -> bool {
    let current_expression = self.expression.clone();
    let expression = current_expression.borrow();

    if let Some(_) = &expression.left {
      if let Value::None = &expression.value {
        return true;
      }
    }

    false
  }

  fn add_left_parentheses(&mut self) {
    let should_add_multiply = self.should_add_multiply_before_parentheses();
    if should_add_multiply {
        println!("add operation");
        self.set_operation(MathOperation::Multiply);
    }

    let current_expression = self.expression.clone();
    let mut expression = current_expression.borrow_mut();

    self.expressions_stack.push(current_expression.clone());

    let left = Rc::new(RefCell::new(Node::new()));
    expression.left = Some(left.clone());

    self.expressions_stack.push(left.clone());
    self.expression = left.clone();
  }

  fn add_right_parentheses(&mut self) {
    self.expressions_stack.pop();
    let root_expression = self.expressions_stack.pop().unwrap();
    self.expression = root_expression.clone();
  }

  fn calculate(self) -> f64 {
    let expression = self.expressions_stack.first().unwrap().borrow();
    expression.get_value()
  }
}
