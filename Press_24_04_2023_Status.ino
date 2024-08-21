#include <WiFi.h>
#include <SPI.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <PubSubClient.h>
#include <FS.h>
#include <EEPROM.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#ifdef ESP32
#include <SPIFFS.h>
#endif

const char* ssid = "TP-Link_5D12";
const char* password = "98720750";
const char* mqtt_server = "192.168.1.2";

////////////////////config/////////////////////////////////////////

IPAddress local_IP(192, 168, 1, 29); // Static IP address192.168.100.164
char machine[5] = "A19";
LiquidCrystal_I2C lcd(0x27, 20, 4); //0x27//3F
//LiquidCrystal_I2C lcd(0x3F, 20, 4); //0x27//3F

////////////////////config/////////////////////////////////////////

IPAddress gateway(192, 168, 1, 1);    // Gateway IP address
IPAddress subnet(255, 255, 255, 0);     // subnet

String mat;

WiFiClient espClient;
PubSubClient client(espClient);


#ifdef ESP32
#include <SPIFFS.h>
#endif

//#include <ArduinoJson.h>

#define LENGTH 40

#define BUILTIN_LED 2

#define led_connection 5
#define led_run 6
#define buzzer 7

#define sw 4

#define relay1 3
#define relay2 1

#define input1 10
#define input2 11
#define input3 12
#define input4 13

#define input5 14
#define input6 15
#define input7 16
#define input8 21

#define input9 40
#define input10 39
#define input11 38
#define input12 37

#define input13 36
#define input14 35
#define input15 34
#define input16 33

#define led_red 41
#define led_green 45
#define led_blue 42

int state1 = 0;
int state2 = 0;
int state3 = 0;
int state4 = 0;
int state5 = 0;
int state6 = 0;
int state7 = 0;
int state8 = 0;
int state9 = 0;
int state10 = 0;
int state11 = 0;
int state12 = 0;
int state13 = 0;
int state14 = 0;
int state15 = 0;
int state16 = 0;

int i, i2;

String Ex_String_Read;

int sta = 1, conf = 0, j, conf_count;

void epprom_clear()
{
  for (int i = 0 ; i < EEPROM.length() ; i++)
  {
    EEPROM.write(i, 0);
  }
}

void setup_wifi()
{
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.config(local_IP, gateway, subnet);
  //WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  int x = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    rgb_off();
    conf = 0;
    x++;
    if (j == 0) {
      lcd.begin();
    }
    lcd.setCursor(0, 0); lcd.print("CONNECT WiFi");
    if (x == 1) {
      lcd.setCursor(12, 0);
      lcd.print(".   ");;
    } if (x == 2) {
      lcd.setCursor(12, 0);
      lcd.print(".. ");
    }
    if (x > 2)
    {
      x = 0;
      lcd.setCursor(12, 0); lcd.print("...");
    }
    delay(1000);
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length)
{
  payload[length] = '\0';
  String my_value = "scan_rfid";
  my_value = String((char*) payload);
  String my_topic = String((char*) topic);
  int ind1 = my_topic.indexOf('_');
  String type = my_topic.substring(0, my_topic.indexOf("_"));

  Serial.println(type);
  Serial.println(my_value);
  mat = my_value;
}

void reconnect()
{
  // Loop until we're reconnected
  if (!client.connected())
  {
    //buz();
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");

      String material = String(machine) + "/material" ;
      const char* machine_material = material.c_str();
      client.subscribe(machine_material);

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      //rgb_red();delay(1000);rgb_off();delay(1000);
    }
    conf = 1;
    i++;
    if (conf_count == 0) {
      lcd.begin();
    }
    lcd.setCursor(0, 0); lcd.print("CONNECT SERVER");
    if (i == 1) {
      lcd.setCursor(14, 0);
      lcd.print(".   ");
    } if (i == 2) {
      lcd.setCursor(14, 0);
      lcd.print(".. ");
    }
    if (i > 2)
    {
      i = 0;
      lcd.setCursor(14, 0); lcd.print("...");
    }
    delay(500);
    conf_count++;
    if (conf_count > 20) {
      ESP.restart();
    }
  }
  if (client.connected())
  {
    //sta=1;
    lcd.begin();
    while (true)
    {
      String check = String(machine) + "/check_status" ;
      const char* check_status = check.c_str();
      client.publish(check_status, "1");
    }
  }

}


hw_timer_t * timer = NULL;
volatile byte state = LOW;

void IRAM_ATTR onTimer()
{
  if (conf <= 0)/////config wifi////////////////////////////////////////
  {
    timerAlarmWrite(timer, 1000000, true);
    state = !state;
    //if(state){rgb_connection();}
    if (!state) {
      rgb_off();
    }
    digitalWrite(led_connection, state);

    j++;
    if (j >= 20) {
      j = 0;
      rgb_off();
      ESP.restart();
    }
  }
  if (conf == 1)//////connect MQTT_Server/////////////////////////////
  {
    timerAlarmWrite(timer, 2000000, true);
    state = !state;
    digitalWrite(led_connection, state);
    //if(state){rgb_connection();}
    if (!state) {
      rgb_off();
    }

  }
  if (conf == 2)//////confiq wifi&MQTT เรียบร้อย///////////////////////
  {
    timerAlarmWrite(timer, 1000000, true);
    digitalWrite(led_connection, HIGH);

  }
  if (sta == 1)///////พร้อมทำงาน//////////////////////////
  {
    rgb_off();
  }
  if (sta == 2)///////Matirial OK/////////////////
  {
    rgb_green();
  }
  if (sta == 3)//////return////////////////////////
  {
    rgb_blue();
  }
  if (sta == 4) ////////finish//////////////////////////////
  {
    rgb_red();
  }
}

void setup()
{
  Serial.begin(9600);
  Serial1.begin(9600);
  lcd.begin();
  //SPIFFS.format();
  //epprom_clear();
  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  pinMode(led_connection, OUTPUT);
  pinMode(led_run, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(led_red, OUTPUT);
  pinMode(led_green, OUTPUT);
  pinMode(led_blue, OUTPUT);
  pinMode(sw, INPUT);
  //pinMode(sw, OUTPUT);
  pinMode(input1, INPUT);
  pinMode(input2, INPUT);
  pinMode(input3, INPUT);
  pinMode(input4, INPUT);
  pinMode(input5, INPUT);
  pinMode(input6, INPUT);
  pinMode(input7, INPUT);
  pinMode(input8, INPUT);
  pinMode(input9, INPUT);
  pinMode(input10, INPUT);
  pinMode(input11, INPUT);
  pinMode(input12, INPUT);
  pinMode(input13, INPUT);
  pinMode(input14, INPUT);
  pinMode(input15, INPUT);
  pinMode(input16, INPUT);
  Serial.println("Booting");
  //WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  rgb_off();
  int x = 0;
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 1000000, true);
  timerAlarmEnable(timer);
  setup_wifi();

  // Port defaults to 3232
  // ArduinoOTA.setPort(3232);

  // Hostname defaults to esp3232-[MAC]
  ArduinoOTA.setHostname(machine);

  // No authentication by default
  ArduinoOTA.setPassword("admin");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");
  ArduinoOTA
  .onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH)
      type = "sketch";
    else // U_SPIFFS
      type = "filesystem";

    // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
    Serial.println("Start updating " + type);
  })
  .onEnd([]() {
    Serial.println("\nEnd");
  })
  .onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  })
  .onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });

  ArduinoOTA.begin();

  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

int h, c, f;
char d0[16], d1[16], d2[16], d3[16], d4[16], d5[16], d6[16];

void loop()
{
  ArduinoOTA.handle();
  if (!client.connected())
  {
    lcd.begin();
    reconnect();
  }
  client.loop();
  if (client.connected())
  {
    state1 = digitalRead(input1);
    state2 = digitalRead(input2);

    String pin3 = String(machine) + "/03" ;
    const char* machine_pin3 = pin3.c_str();

    String pin10 = String(machine) + "/10" ;
    const char* machine_pin10 = pin10.c_str();

    String pin11 = String(machine) + "/11" ;
    const char* machine_pin11 = pin11.c_str();

    conf = 2;
    lcd_show();
    Serial.println(WiFi.RSSI());
    delay(1000);
    Serial.println(mat);
    if (mat == "True")
    {
      sta = 1;
    }
    if (mat == "1")
    {
      sta = 2;
      digitalWrite(relay1, HIGH); delay(1000); digitalWrite(relay1, LOW);
      client.publish(machine_pin3, "True");
      mat = " ";
    }
    if (mat == "2")
    {
      sta = 3;
    }
    if (mat == "3")
    {
      sta = 4;
    }
    if (state1 == LOW && sta == 2)
    {
      client.publish(machine_pin10, "True");
      digitalWrite(led_run, HIGH); delay(1000); digitalWrite(led_run, LOW);
    }
    if (state2 == LOW && sta == 2)
    {
      client.publish(machine_pin11, "True");
      digitalWrite(led_run, HIGH); delay(1000); digitalWrite(led_run, LOW);
    }
  }
}

int i1;


void lcd_show()
{
  i1++;
  String oven1;
  //oven1 = oven_no.substring(13,8);
  lcd.setCursor(0, 0); lcd.print("Machine : "); lcd.print(machine);
  lcd.setCursor(0, 1); lcd.print("IP : "); lcd.print(WiFi.localIP());
  lcd.setCursor(0, 2); lcd.print("RSSI : "); lcd.print(WiFi.RSSI());
  lcd.setCursor(0, 3); lcd.print("Msg  : ");
  if (sta == 1 || sta == 0) {
    lcd.setCursor(7, 3);
    lcd.print("Ready        ");
  }
  if (sta == 2) {
    lcd.setCursor(7, 3);
    lcd.print("Mat. OK      ");
  }
  if (sta == 3) {
    lcd.setCursor(7, 3);
    lcd.print("Mat. return  ");
  }
  if (sta == 4) {
    lcd.setCursor(7, 3);
    lcd.print("Mat. finish  ");
  }
}

void buz()
{
  digitalWrite(buzzer, HIGH); delay(100); digitalWrite(buzzer, LOW); delay(100);
}

void rgb_connection()
{
  analogWrite(led_red, 180); analogWrite(led_green, 150); analogWrite(led_blue, 255);
}

void rgb_red()
{
  analogWrite(led_red, 0); analogWrite(led_green, 255); analogWrite(led_blue, 255);
}

void rgb_green()
{
  analogWrite(led_red, 255); analogWrite(led_green, 0); analogWrite(led_blue, 255);
}

void rgb_blue()
{
  analogWrite(led_red, 255); analogWrite(led_green, 255); analogWrite(led_blue, 0);
}

void rgb_off()
{
  analogWrite(led_red, 255); analogWrite(led_green, 255); analogWrite(led_blue, 255);
}
