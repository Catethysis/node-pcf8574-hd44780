const lcd = require('./pcf8574-hd44780');

let LCD = new lcd(1, 0x27);
LCD.init_hd44780();
LCD.print_string(`1234${LCD.degree_sign}567890,hello world!abcdefghijklmnopqrst9876543210`);