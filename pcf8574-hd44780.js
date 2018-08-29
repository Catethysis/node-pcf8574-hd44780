const i2c = require('i2c-bus');
let I2C, pcf_addr;

module.exports = class pcf8574_hd44780 {
  constructor (i2c_module, addr) {
    I2C = i2c.openSync(i2c_module);
    pcf_addr = addr;
  }

  byte_out (data) {
    I2C.sendByteSync(pcf_addr, data);
  }

  sendCommand (cmd) {
    cmd |= 0x08; this.byte_out(cmd);
    cmd |= 0x04; this.byte_out(cmd);
    cmd &= 0xFB; this.byte_out(cmd);
  }

  init (i2c_module, addr) {
    const initString = [0x30, 0x30, 0x30, 0x20, 0x20, 0x80, 0x00, 0x80, 0x00, 0x10, 0x00, 0x60, 0x00, 0xC0];
    initString.forEach(cmd => this.sendCommand(cmd));
  }

  char_out (char) {
    let char_h = ((char & 0xF0) + 0x09);
    let char_l = (((char & 0x0F) << 4) + 0x09);

    this.byte_out(char_h);
    char_h |= 0x04;
    this.byte_out(char_h);
    char_h &= 0xF9;
    this.byte_out(char_h);

    this.byte_out(char_l);
    char_l |= 0x04;
    this.byte_out(char_l);
    char_l &= 0xF9;
    this.byte_out(char_l);
  }

  print_line (line) {
    for (let i = 0; i < line.length; i++)
    this.char_out(line.charCodeAt(i));
  }

  print_string (str) {
    const line_length = 16;
    const cgram_line_gap = line_length + line_length / 2;

    let line1 = str.slice(0, line_length);
    let line2 = str.slice(line_length, line_length * 2);

    this.print_line(line1);
    if(line2.length) {
      this.print_line(Array(cgram_line_gap + 1).join(' '));
      this.print_line(line2);
    }
  }

  get degree_sign() {
    return 'ß';
  }
}