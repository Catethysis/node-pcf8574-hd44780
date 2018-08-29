const i2c = require('i2c-bus');
let i2c1, pcf_addr;
 
pcf8574_byte_out = (data) => {
    i2c1.sendByteSync(pcf_addr, data);
}

sendCommand = (cmd) => {
	cmd |= 0x08; pcf8574_byte_out(cmd);
	cmd |= 0x04; pcf8574_byte_out(cmd);
	cmd &= 0xFB; pcf8574_byte_out(cmd);
}

init = (i2c_module, addr) => {
    i2c1 = i2c.openSync(i2c_module);
    pcf_addr = addr;
    const initString = [0x30, 0x30, 0x30, 0x20, 0x20, 0x80, 0x00, 0x80, 0x00, 0x10, 0x00, 0x60, 0x00, 0xC0];
    initString.forEach(cmd => sendCommand(cmd));
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

print_string = (str) => {
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

module.exports = {
    degree_sign: 'ß',
    init,
    print_string
};