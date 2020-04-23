use std::str::FromStr;
use std::f64::consts::PI;
use std::f64::consts::E;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

static PI_STR: &str = "pi";
static E_STR: &str = "e";

fn parse_float(value: &str) -> f64 {
    if value == PI_STR {
        return PI;
    }

    if value == E_STR {
        return E;
    }

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

#[wasm_bindgen]
pub fn add(value1: &str, value2: &str) -> String {
    let value1_num = parse_float(value1);
    let value2_num = parse_float(value2);

    let result = value1_num + value2_num;
    result.to_string()
}

#[wasm_bindgen]
pub fn subtract(value1: &str, value2: &str) -> String {
    let value1_num = parse_float(value1);
    let value2_num = parse_float(value2);

    let result = value1_num - value2_num;
    result.to_string()
}

#[wasm_bindgen]
pub fn divide(value1: &str, value2: &str) -> String {
    let num1 = parse_float(value1);
    let num2 = parse_float(value2);

    let result = num1 / num2;
    result.to_string()
}

#[wasm_bindgen]
pub fn multiply(value1: &str, value2: &str) -> String {
    let num1 = parse_float(value1);
    let num2 = parse_float(value2);

    let result = num1 * num2;
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_cos(value: &str) -> String {
    let num = parse_float(value);

    let result = num.cos();
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_arccos(value: &str) -> String {
    let num = parse_float(value);

    let result = num.acos();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_sin(value: &str) -> String {
    let num = parse_float(value);

    let result = num.sin();
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_arcsin(value: &str) -> String {
    let num = parse_float(value);

    let result = num.asin();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_ln(value: &str) -> String {
    let num = parse_float(value);

    let result = num.ln();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_log(value: &str) -> String {
    let num = parse_float(value);

    let result = num.log10();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_tan(value: &str) -> String {
    let num = parse_float(value);

    let result = num.tan();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_arctan(value: &str) -> String {
    let num = parse_float(value);

    let result = num.atan();
    result.to_string()
}

#[wasm_bindgen]
pub fn calc_sqrt(value: &str) -> String {
    let num = parse_float(value);

    let result = num.sqrt();
    if result.is_nan() {
        return "".to_string();
    }
    result.to_string()
}
