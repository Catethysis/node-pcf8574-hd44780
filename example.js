const lcd = require('./pcf8574-hd44780');

lcd.init(1, 0x27);
lcd.print_string(`1234${lcd.degree_sign}567890,hello world!abcdefghijklmnopqrst9876543210`);