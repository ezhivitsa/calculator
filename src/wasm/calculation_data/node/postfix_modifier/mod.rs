use statrs::function::gamma;

use wasm_bindgen::prelude::*;

const DIFF_TO_IGNORE: f64 = 0.000000000001;

#[wasm_bindgen]
pub enum PostfixModifier {
  Factorial,
  Percent
}

pub fn copy_modifier(modifier: &PostfixModifier) -> PostfixModifier {
  match modifier {
    PostfixModifier::Factorial => PostfixModifier::Factorial,
    PostfixModifier::Percent => PostfixModifier::Percent,
  }
}

pub fn apply_modifier(value: &f64, modifier: &PostfixModifier) -> f64 {
  match modifier {
    PostfixModifier::Factorial => {
      let integer_part = *value as u32;

      let diff = (*value - integer_part as f64).abs();
      if diff < DIFF_TO_IGNORE {
        gamma::gamma(*value + 1.0).round()
      } else {
        gamma::gamma(*value + 1.0)
      }

    },
    PostfixModifier::Percent => {
      *value / 100.0
    }
  }
}
