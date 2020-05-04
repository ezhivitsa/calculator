use std::rc::Rc;
use std::cell::RefCell;

pub mod math_operation;
pub use math_operation::{MathOperation};

pub mod modifier;
pub use modifier::{Modifier, Measurement};

pub enum Value {
  None,
  Float(f64),
  Operation(MathOperation),
  Modifier(Modifier)
}

pub struct Node {
  value: Value,
  left: Option<Rc<RefCell<Node>>>,
  right: Option<Rc<RefCell<Node>>>,
}

impl Node {
  pub fn new() -> Node {
    Node {
      value: Value::None,
      left: None,
      right: None
    }
  }

  pub fn set_value(&mut self, value: Value) {
    self.value = value;
  }

  pub fn set_left(&mut self, node: Rc<RefCell<Node>>) {
    self.left = Some(node);
  }

  pub fn set_right(&mut self, node: Rc<RefCell<Node>>) {
    self.right = Some(node);
  }

  pub fn get_value(&self, measurement: &Measurement) -> f64 {
    match &self.value {
      Value::Float(value) => {
        *value
      },

      Value::Operation(operation) => {
        let left_value = match &self.left {
          Some(node) => {
            node.borrow().get_value(measurement)
          },
          None => {
            panic!("Error when get left_value");
          }
        };

        let right_value = match &self.right {
          Some(node) => {
            node.borrow().get_value(measurement)
          },
          None => {
            panic!("Error when get right_value");
          }
        };

        math_operation::apply_operation(&left_value, &right_value, operation)
      },

      Value::Modifier(modifier) => {
        let left_value = match &self.left {
          Some(node) => {
            node.borrow().get_value(measurement)
          },
          None => {
            panic!("Error when get expression for modifier");
          }
        };

        modifier::apply_modifier(&left_value, modifier, measurement)
      },

      Value::None => {
        match &self.left {
          Some(node) => {
            node.borrow().get_value(measurement)
          },
          None => {
            panic!("Error when get left value for node with Node value");
          }
        }
      }
    }
  }

  pub fn validate(&self) -> bool {
    match &self.value {
      Value::Float(_) => {
        true
      },

      Value::Operation(_) => {
        let left_valid = match &self.left {
          Some(node) => {
            node.borrow().validate()
          },
          None => {
            false
          }
        };

        let right_valid = match &self.right {
          Some(node) => {
            node.borrow().validate()
          },
          None => {
            false
          }
        };

        left_valid && right_valid
      },

      Value::Modifier(_) => {
        match &self.left {
          Some(node) => {
            node.borrow().validate()
          },
          None => {
            false
          }
        }
      },

      Value::None => {
        false
      }
    }
  }

  pub fn copy_value(&self) -> Value {
    match &self.value {
      Value::None => Value::None,
      Value::Float(val) => Value::Float(*val),
      Value::Operation(operation) => Value::Operation(math_operation::copy_operation(operation)),
      Value::Modifier(modifier) => Value::Modifier(modifier::copy_modifier(modifier))
    }
  }

  pub fn clone(&self) -> Node {
    Node {
      value: self.copy_value(),
      left: self.left.clone(),
      right: self.right.clone()
    }
  }

  pub fn should_add_multiply_before_parentheses(&self) -> bool {
    if let Some(_) = &self.left {
      if let Value::None = &self.value {
        return true;
      }
    }

    false
  }

  pub fn has_value(&self) -> bool {
    match &self.value {
      Value::Float(_) | Value::Modifier(_) => true,
      Value::None | Value::Operation(_) => false
    }
  }
}
