use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum Modifier {
  Sin,
  Asin,
  Ln,
  Cos,
  Acos,
  Log,
  Tan,
  Atan,
  SquareRoot,
}

pub fn copy_modifier(modifier: &Modifier) -> Modifier {
  match modifier {
    Modifier::Sin => Modifier::Sin,
    Modifier::Asin => Modifier::Asin,
    Modifier::Ln => Modifier::Ln,
    Modifier::Cos => Modifier::Cos,
    Modifier::Acos => Modifier::Acos,
    Modifier::Log => Modifier::Log,
    Modifier::Tan => Modifier::Tan,
    Modifier::Atan => Modifier::Atan,
    Modifier::SquareRoot => Modifier::SquareRoot,
  }
}

pub fn apply_modifier(value: &f64, modifier: &Modifier) -> f64 {
  match modifier {
    Modifier::Sin => value.sin(),
    Modifier::Asin => value.asin(),
    Modifier::Ln => value.ln(),
    Modifier::Cos => value.cos(),
    Modifier::Acos => value.acos(),
    Modifier::Log => value.log10(),
    Modifier::Tan => value.tan(),
    Modifier::Atan => value.atan(),
    Modifier::SquareRoot => value.sqrt(),
  }
}