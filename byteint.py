#Import libraries we'll need to use
import serial
import struct

baudrate = 9600
#serialport = "/dev/ttyUSB0"  # serial port on the raspi
serialport = "COM2"
preamble = ["0xFE", "0xFE", "0x00", "0xE0", "0x05", "0x00", "0x61", "0x54", "0x03", "0x00", "0xFD"]
#Should return þþ[00]à[05][00]aT[03][00]ý

ser = serial.Serial(serialport, baudrate)

count = 0
while(count < 11):
    senddata = int(bytes(preamble[count], 'UTF-8'), 16)
    print(struct.pack('>B', senddata))
    ser.write(struct.pack('>B', senddata))
    count = count +1

ser.close()
