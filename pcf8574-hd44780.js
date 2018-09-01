const i2c = require('i2c-bus');

module.exports = class pcf8574_hd44780 {
  constructor ({i2cbus, pcf8574_addr}) {
    this.I2C = i2c.openSync(i2cbus);
    this.pcf_addr = pcf8574_addr;
    this.led = false;
  }

  scan_pcf8574 (callback) {
    // PCF8274 can only accept 20h..27h addresses
    let pcf8574_devices = this.I2C.scanSync(0x20, 0x27);

    // PCF8274A can only accept 38h..3Fh addresses
    let pcf8574a_devices = this.I2C.scanSync(0x38, 0x3F);

    let devices = pcf8574_devices.concat(pcf8574a_devices);
    callback(devices);
  }

  set pcf8574_addr (addr) {
    this.pcf_addr = addr;
  }

  byte_out (data) {
    this.I2C.sendByteSync(this.pcf_addr, (this.led) ? data | 0x08 : data);
  }

  sendCommand (cmd) {
    this.byte_out(cmd);
    cmd |= 0x04; this.byte_out(cmd);
    cmd &= 0xFB; this.byte_out(cmd);
  }

  init_hd44780 () {
    const initString = [0x30, 0x30, 0x30, 0x20, 0x20, 0x80, 0x00, 0x80, 0x00, 0x10, 0x00, 0x60, 0x00, 0xC0];
    initString.forEach(cmd => this.sendCommand(cmd));
  }

  nibble_out (nibble) {
    this.byte_out(nibble);
    nibble |= 0x04;
    this.byte_out(nibble);
    nibble &= 0xF9;
    this.byte_out(nibble);
  }

  char_out (char) {
    let char_h = ((char & 0xF0) + 0x01);
    let char_l = (((char & 0x0F) << 4) + 0x01);

    this.nibble_out(char_h);
    this.nibble_out(char_l);
  }

  print_line (line) {
    for (let i = 0; i < line.length; i++)
      this.char_out(line.charCodeAt(i));
  }

  print_lines (lines) {
    lines.forEach(line => this.print_line(line));
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

  get special_signs () {
    return {
      right_arrow: String.fromCharCode(0x7E),
       left_arrow: String.fromCharCode(0x7F),
      bold_dot   : String.fromCharCode(0xA5),
      square     : String.fromCharCode(0xDB),
      degree     : String.fromCharCode(0xDF),
      ohm        : String.fromCharCode(0xF4),
      divide     : String.fromCharCode(0xFD),
      empty_space: String.fromCharCode(0xFE),
      black_space: String.fromCharCode(0xFF),
    };
  }
}