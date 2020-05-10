pub fn apply_power(value: f64, power: f64) -> f64 {
  value.powf(power)
}

pub fn apply_root(value: f64, root: f64) -> f64 {
  if root == 2.0 {
    value.sqrt()
  } else if root == 3.0 {
    value.cbrt()
  } else {
    value.powf(1.0 / root)
  }
}