use std::f64::consts::PI;

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

#[wasm_bindgen]
pub enum Measurement {
  Rad,
  Deg
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

fn get_value_for_measurement(value: &f64, measurement: &Measurement) ->f64 {
  match measurement {
    Measurement::Rad => {
      *value
    },
    Measurement::Deg => {
      *value * PI / 180.0
    }
  }
}

pub fn apply_modifier(
  value: &f64,
  modifier: &Modifier,
  measurement: &Measurement
) -> f64 {
  let value_for_measurement = get_value_for_measurement(value, measurement);

  match modifier {
    Modifier::Sin => value_for_measurement.sin(),
    Modifier::Asin => value_for_measurement.asin(),
    Modifier::Ln => value.ln(),
    Modifier::Cos => value_for_measurement.cos(),
    Modifier::Acos => value_for_measurement.acos(),
    Modifier::Log => value.log10(),
    Modifier::Tan => value_for_measurement.tan(),
    Modifier::Atan => value_for_measurement.atan(),
    Modifier::SquareRoot => value.sqrt(),
  }
}