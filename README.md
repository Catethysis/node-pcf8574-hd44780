# node-pcf8574-hd44780

## If you know PCF8574 address

```js
const lcd = require('./pcf8574-hd44780');
let LCD = new lcd({i2cbus: 1, pcf8574_addr: 0x27});

LCD.init_hd44780();
LCD.print_string(`Temperature: 27${LCD.degree_sign}C`);
```

##If you need to search PCF8574 on the bus first

```js
const lcd = require('./pcf8574-hd44780');
let LCD = new lcd({i2cbus: 1});

LCD.scan_pcf8574((err, dev) => {
    // You can select a specific PCF chip on the bus if you have several
    LCD.pcf8574_addr = dev[0];
    LCD.init_hd44780();
    LCD.print_string(`Temperature: 27${LCD.degree_sign}C`);
});
```