use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum MathOperation {
  Divide,
  Multiply,
  Minus,
  Plus,
}

pub fn copy_operation(operation: &MathOperation) -> MathOperation {
  match operation {
    MathOperation::Divide => MathOperation::Divide,
    MathOperation::Multiply => MathOperation::Multiply,
    MathOperation::Minus => MathOperation::Minus,
    MathOperation::Plus => MathOperation::Plus,
  }
}

pub fn apply_operation(value1: &f64, value2: &f64, operation: &MathOperation) -> f64 {
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
