pub enum Message {
    Add(u32),
    Remove(u32)
}

pub struct Calculator {
    messages: Vec<Message>,
    pub value: u32
}

impl Calculator {
    pub const fn new() -> Calculator {
        Calculator {
            messages: Vec::new(),
            value: 0
        }
    }

    pub fn add_message(&mut self, message: Message) {
        self.messages.push(message);
        self.calculate_value();
    }

    pub fn clear(&mut self) {
        self.messages.clear();
        self.value = 0;
    }

    fn calculate_value(&mut self) {
        let mut result = 0;
        for message in self.messages.iter() {
            match message {
                Message::Add(value) => {
                    result += value;
                }

                Message::Remove(value) => {
                    result -= value;
                }
            }
        }
        self.value = result;
    }
}
