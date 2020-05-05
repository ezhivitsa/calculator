use std::f64::consts::PI;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum PrefixModifier {
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

pub fn copy_modifier(modifier: &PrefixModifier) -> PrefixModifier {
  match modifier {
    PrefixModifier::Sin => PrefixModifier::Sin,
    PrefixModifier::Asin => PrefixModifier::Asin,
    PrefixModifier::Ln => PrefixModifier::Ln,
    PrefixModifier::Cos => PrefixModifier::Cos,
    PrefixModifier::Acos => PrefixModifier::Acos,
    PrefixModifier::Log => PrefixModifier::Log,
    PrefixModifier::Tan => PrefixModifier::Tan,
    PrefixModifier::Atan => PrefixModifier::Atan,
    PrefixModifier::SquareRoot => PrefixModifier::SquareRoot,
  }
}

fn get_value_for_measurement(value: &f64, measurement: &Measurement) ->f64 {
  match measurement {
    Measurement::Rad => {
      *value
    },
    Measurement::Deg => {
      value.to_degrees()
    }
  }
}

pub fn apply_modifier(
  value: &f64,
  modifier: &PrefixModifier,
  measurement: &Measurement
) -> f64 {
  let value_for_measurement = get_value_for_measurement(value, measurement);

  match modifier {
    PrefixModifier::Sin => value_for_measurement.sin(),
    PrefixModifier::Asin => value_for_measurement.asin(),
    PrefixModifier::Ln => value.ln(),
    PrefixModifier::Cos => value_for_measurement.cos(),
    PrefixModifier::Acos => value_for_measurement.acos(),
    PrefixModifier::Log => value.log10(),
    PrefixModifier::Tan => value_for_measurement.tan(),
    PrefixModifier::Atan => value_for_measurement.atan(),
    PrefixModifier::SquareRoot => value.sqrt(),
  }
}