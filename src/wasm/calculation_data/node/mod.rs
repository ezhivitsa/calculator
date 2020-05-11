use std::rc::Rc;
use std::cell::RefCell;

pub mod math_operation;
pub use math_operation::MathOperation;

pub mod prefix_modifier;
pub use prefix_modifier::{PrefixModifier, Measurement};

pub mod postfix_modifier;
pub use postfix_modifier::PostfixModifier;

pub mod power;

pub enum Value {
  None,
  Float(f64),
  Operation(MathOperation),
  PrefixModifier(PrefixModifier),
  PostfixModifier(PostfixModifier),
  Power,
  Root
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

  pub fn set_right_value(&mut self, value: Value) {
    match &self.right {
      Some(node) => {
        node.borrow_mut().set_value(value);
      },
      None => {
        let mut left = Node::new();
        left.set_value(value);

        self.left = Some(Rc::new(RefCell::new(left)));
      }
    }
  }

  pub fn clear_right(&mut self) {
    self.right = None;
  }

  fn get_left_value(&self, measurement: &Measurement, error_message: &str) -> f64 {
    match &self.left {
      Some(node) => {
        node.borrow().get_value(measurement)
      },
      None => {
        panic!(String::from(error_message));
      }
    }
  }

  fn get_right_value(&self, measurement: &Measurement, error_message: &str) -> f64 {
    match &self.right {
      Some(node) => {
        node.borrow().get_value(measurement)
      },
      None => {
        panic!(String::from(error_message));
      }
    }
  }

  pub fn get_value(&self, measurement: &Measurement) -> f64 {
    match &self.value {
      Value::Float(value) => {
        *value
      },

      Value::Operation(operation) => {
        let left_value = self.get_left_value(
          measurement,
          "Error when get left_value"
        );
        let right_value = self.get_right_value(
          measurement,
          "Error when get right_value"
        );

        math_operation::apply_operation(&left_value, &right_value, operation)
      },

      Value::PrefixModifier(modifier) => {
        let left_value = self.get_left_value(
          measurement,
          "Error when get expression for prefix modifier"
        );
        prefix_modifier::apply_modifier(&left_value, modifier, measurement)
      },

      Value::PostfixModifier(modifier) => {
        let left_value = self.get_left_value(
          measurement,
          "Error when get expression for postfix modifier"
        );
        postfix_modifier::apply_modifier(&left_value, modifier)
      },

      Value::Power => {
        let left_value = self.get_left_value(
          measurement,
          "Error when get left value for power"
        );
        let right_value = self.get_right_value(
          measurement,
          "Error when get right value for power"
        );
        
        power::apply_power(left_value, right_value)
      },

      Value::Root => {
        let left_value = self.get_left_value(
          measurement,
          "Error when get left value for root"
        );
        let right_value = self.get_right_value(
          measurement,
          "Error when get right value for root"
        );
        
        power::apply_root(left_value, right_value)
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

  fn validate_left(&self) -> bool {
    match &self.left {
      Some(node) => {
        node.borrow().validate()
      },
      None => {
        false
      }
    }
  }

  fn validate_right(&self) -> bool {
    match &self.right {
      Some(node) => {
        node.borrow().validate()
      },
      None => {
        false
      }
    }
  }

  pub fn validate(&self) -> bool {
    match &self.value {
      Value::Float(_) => {
        true
      },

      Value::Operation(_) | Value::Power | Value::Root => {
        let left_valid = self.validate_left();
        let right_valid = self.validate_right();

        left_valid && right_valid
      },

      Value::PrefixModifier(_) => {
        self.validate_left()
      },

      Value::PostfixModifier(_) => {
        self.validate_left()
      }

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
      Value::PrefixModifier(modifier) => Value::PrefixModifier(prefix_modifier::copy_modifier(modifier)),
      Value::PostfixModifier(modifier) => Value::PostfixModifier(postfix_modifier::copy_modifier(modifier)),
      Value::Power => Value::Power,
      Value::Root => Value::Root
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

  pub fn is_operation_or_none(&self) -> bool {
    match &self.value {
      Value::Float(_) |
      Value::PrefixModifier(_) |
      Value::PostfixModifier(_) |
      Value::Power |
      Value::Root => false,
      Value::None | Value::Operation(_) => true
    }
  }
}
