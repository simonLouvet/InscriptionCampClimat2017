function MainStore() {

  riot.observable(this) // Riot provides our event emitter.

  this.makeRequest = function(key, select, offset) {

    return new Promise((resolve, reject) => {

      sheetrock({
        url: 'https://docs.google.com/spreadsheets/d/' + key,
        reset: true,
        query: select,
        callback: function(error, options, response) {
          //console.log('callback sheetrock',error,options,response);
          if (!error || error == null) {
            var cleanData = [];

            for (var recordKey in response.raw.table.rows) {
              if (recordKey < offset) {
                continue;
              }
              var record = response.raw.table.rows[recordKey];
              //console.log('record',record);
              var cleanRecord = {};
              for (var cellKey in record.c) {
                var cell = record.c[cellKey];
                var column = response.raw.table.cols[cellKey].id || cellKey;
                //  console.log('column',column);
                cleanRecord[column] = cell == null ? undefined : cell.v;

              }
              cleanData.push(cleanRecord);
            }

            resolve({
              data: cleanData
            });

          } else {
            console.log('Google query rejected | ', error);
            reject({
              "error": error
            });
          }
        }.bind(this)
      });
    });
  };

  this.disAllowSameTime = function(slotToDisallow, checked) {
    console.log(slotToDisallow);
    sift({
        $and: [{
            booked: false
          },
          {
            date: slotToDisallow.date
          }, {
            $or: [{
                $and: [{
                  dayTimeDebut: {
                    $gte: slotToDisallow.dayTimeDebut
                  }
                }, {
                  dayTimeDebut: {
                    $lt: slotToDisallow.dayTimeFin
                  }
                }]
              },
              {
                $and: [{
                  dayTimeFin: {
                    $gt: slotToDisallow.dayTimeDebut
                  }
                }, {
                  dayTimeFin: {
                    $lte: slotToDisallow.dayTimeFin
                  }
                }]
              }
            ]
          }
        ]
      },
      this.slots).forEach(slot => {
      //console.log('DISALLOW', slot);
      slot.disallow = checked;
    });
  }


  this.on('email_change', function(email) {
      this.email=email;
      this.trigger('slots_init');
  });

  this.on('persist_slots', function() {
    var exportData=[];
    sift({
      booked: true
    }, this.slots).forEach(slot => {
      exportData.push([this.email,slot.A,slot.B,slot.C,slot.D,slot.E]);
    });

    $.ajax({
      method: 'post',
      url: 'https://sheets.googleapis.com/v4/spreadsheets/1mog4J4TFeHvYir5qVDfHhyGpDjmUt9QyvH7tS1lnU54/values/inscriptions!A1:K1:append?valueInputOption=RAW',
      data: JSON.stringify({
          "range": "inscriptions!A1:K1",
          "majorDimension": "ROWS",
          "values": exportData,
        }

      ),
      headers: {
        Authorization: 'Bearer ' + 'ya29.GltwBKi8oZPXW0A-NNpyymLpvJqUnSthJ7s76l2J70glSR9voED2ffp9jTw_covmajoJIYGCAtWQr-n2fXtEKAywnqt7fBkUo_0qgqm6D8evi3HIXpIerYM_1Yfq'
      },
      contentType: 'application/json'
    }).done(function(data) {
      console.log(data);
    }.bind(this));
  });

  this.on('switch_select', function(slot, checked) {
    sift({
      id: slot.id
    }, this.slots).forEach(slot => {
      slot.checked = checked;
      slot.booked = checked;
      this.disAllowSameTime(slot, checked)
    });

    sift({
      B: slot.B,
      D: {
        $ne: slot.D
      },
      L: {
        $exists: true
      }
    }, this.slots).forEach(slot => {
      slot.booked = checked;
      this.disAllowSameTime(slot, checked)
    });

    //console.log(this.slots);
    this.trigger('days_changed', this.days);
  });

  this.on('slots_init', function() {
    this.makeRequest("11iOoq00Hy8vMHDksubOUUDXvgf5YD1qz_-cUJlWDScE#gid=1048305501", "select A,B,C,D,E,F,G,L,H,I,J,K order by C asc, H asc", 0).then(sheet => {
      this.slots = sheet.data;
      var id = 1;
      for (slot of this.slots) {
        slot.id = id;
        id++;
      }
      var slotsForRequest = this.slots.slice(0);
      //console.log(sift);
      this.days = [];
      for (slot of this.slots) {
        slot.checked = false;
        slot.disallow = false;
        slot.booked = false;
        slot.date = eval('new ' + slot.C);
        slot.dayTimeDebut = slot.H * 60 + slot.I;
        slot.dayTimeFin = slot.J * 60 + slot.K;
        if (slot.L != undefined) {
          slot.mainSlots = sift({
            B: slot.B,
            D: {
              $ne: slot.D
            },
            L: {
              $exists: false
            }
          }, slotsForRequest)
        } else {
          slot.otherSlots = sift({
            B: slot.B,
            D: {
              $ne: slot.D
            },
            L: {
              $exists: true
            }
          }, slotsForRequest);
        }
      }
      for (slot of this.slots) {
        var currentDay = {};
        var dayExist = false;
        for (day of this.days) {
          //console.log(day.date,slot.date);
          if (day.date.getTime() == slot.date.getTime()) {
            dayExist = true;
            day.slots.push(slot);
            //currentDay= day;
            break;
          }
        }
        if (!dayExist) {
          //console.log(slot.date);
          this.days.push({
            date: slot.date,
            slots: [slot]
          });
          //currentDay=days[days.length-1];
        }
      }
      this.trigger('days_changed', this.days);
    })
  });

}
