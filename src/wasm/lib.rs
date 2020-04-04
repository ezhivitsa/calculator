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

    //CALCULATOR.clear();
    console::log_1(&JsValue::from_str("Hello!1"));

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

    pub fn add(&mut self, value: &str) {
        let value_num = f64::from_str(value).unwrap();
        self.value += value_num;
    }
}