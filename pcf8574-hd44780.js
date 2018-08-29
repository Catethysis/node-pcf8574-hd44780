const i2c = require('i2c-bus');
const i2c1 = i2c.openSync(1);
 
i2c1.sendByteSync(0x27, 0xff);

pcf8574_byte_out = (data) => {
    i2c1.sendByteSync(0x27, data);
}

com = (com) => {
	com |= 0x08;
	pcf8574_byte_out(com);
	com |= 0x04;
	pcf8574_byte_out(com);
	com &= 0xFB;
	pcf8574_byte_out(com);
}

init = () => {
    const initString = [0x30, 0x30, 0x30, 0x20, 0x20, 0x80, 0x00, 0x80, 0x00, 0x10, 0x00, 0x60, 0x00, 0xC0];
    initString.forEach(command => com(command));
}

char_out = (char) => {
    let char_h = ((char & 0xF0) + 0x09);
    let char_l = (((char & 0x0F) << 4) + 0x09);

	pcf8574_byte_out(char_h);
	char_h |= 0x04;
	pcf8574_byte_out(char_h);
	char_h &= 0xF9;
	pcf8574_byte_out(char_h);

	pcf8574_byte_out(char_l);
	char_l |= 0x04;
	pcf8574_byte_out(char_l);
	char_l &= 0xF9;
	pcf8574_byte_out(char_l);
}

print_line = (line) => {
    for (let i = 0; i < line.length; i++)
        char_out(line.charCodeAt(i));
}

str_out = (str) => {
    const line_length = 16;
    const cgram_line_gap = line_length + line_length / 2;

    let line1 = str.slice(0, line_length);
    let line2 = str.slice(line_length, line_length * 2);

    print_line(line1);
    if(line2.length) {
        print_line(Array(cgram_line_gap + 1).join(' '));
        print_line(line2);
    }
}

const degree = 'ß';
init();
str_out(`1234${degree}567890,hello world!abcdefghijklmnopqrst9876543210`);