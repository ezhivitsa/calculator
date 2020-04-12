use std::str::FromStr;

use wasm_bindgen::prelude::*;
use web_sys::console;

//use calculator::{Message, Calculator};

//pub mod calculator;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

//const CALCULATOR: Calculator = Calculator::new();

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

// fn handle_messages(message: Message) {
//     CALCULATOR.add_message(message);
// }

// #[wasm_bindgen]
// pub fn send_message_add(value: u32) {
//     handle_messages(Message::Add(value));
// }

// #[wasm_bindgen]
// pub fn send_message_remove(value: u32) {
//     handle_messages(Message::Remove(value));
// }

fn parse_float(value: &str) -> f64 {
    let result = f64::from_str(value);
    match result {
        Ok(num) => {
            num
        }
        Err(err) => {
            panic!("Unable to convert {} into number", value)
        }
    }
}

#[wasm_bindgen]
pub struct Calculator {
    pub value: f64,
}

#[wasm_bindgen]
impl Calculator {
    pub fn new()-> Calculator {
        Calculator {
            value: 0.0
        }
    }

    pub fn set(&mut self, value: &str) {
        let value_num = parse_float(value);
        self.value = value_num;
    }

    pub fn add(&mut self, value: &str) {
        let value_num = parse_float(value);
        self.value += value_num;
    }

    pub fn subtract(&mut self, value: &str) {
        let value_num = parse_float(value);
        self.value -= value_num;
    }

    pub fn result(&self) -> String {
        self.value.to_string()
    }

    pub fn reset(&mut self) {
        self.value = 0.0;
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