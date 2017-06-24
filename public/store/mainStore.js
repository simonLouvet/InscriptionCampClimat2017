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
    this.makeRequest("1aJXvBugaH0ejrPaKQcEX1YeEW8hCrM8ctEeuwqEPNJs#gid=2008365008", "select B,C,D,J,L", 0).then(sheet => {
      var userFinded = sift({
        D: email
      }, sheet.data);
      if (userFinded.length > 0) {
        this.user = userFinded[0];
        this.user.dateDebut = eval('new ' + this.user.J);
        this.user.dateDebutInputValue = ("0" + this.user.dateDebut.getDate()).slice(-2) + '/' + ("0" + (this.user.dateDebut.getMonth() + 1)).slice(-2) + '/' + this.user.dateDebut.getFullYear();
        this.user.dateFin = eval('new ' + this.user.L);
        this.user.dateFinInputValue = ("0" + this.user.dateFin.getDate()).slice(-2) + '/' + ("0" + (this.user.dateFin.getMonth() + 1)).slice(-2) + '/' + this.user.dateFin.getFullYear();
        console.log(this.user);
        this.trigger('user_connected', this.user);
        this.trigger('slots_init');
      } else {
        this.trigger('user_not_connected');
      }

    });
  });

  this.on('dateDebut_change', function(date, str) {
    console.log(date);
    this.user.dateDebut = date;
    this.user.dateDebutInputValue = str;
    this.trigger('days_changed', this.resctrictDate(this.days));
  });

  this.on('dateFin_change', function(date, str) {
    //console.log(date);
    this.user.dateFin = date;
    this.user.dateFinInputValue = str;
    this.trigger('days_changed', this.resctrictDate(this.days));
  });

  this.on('persist_slots', function() {
    var exportData = [];
    sift({
      booked: true
    }, this.slots).forEach(slot => {
      exportData.push({
        horadateur: new Date(),
        email: this.user.email,
        formation: slot.A,
        session: slot.B,
        dateDisplay: slot.dateDisplay,
        date: slot.date,
        Hdebut: slot.D,
        Hfin: slot.E
      });
    });
    //AIzaSyAKkzvBdhB0WRBJpZfNoG7KLfA1ye3uues
    // $.ajax({
    //   method: 'post',
    //   url: 'https://sheets.googleapis.com/v4/spreadsheets/1mog4J4TFeHvYir5qVDfHhyGpDjmUt9QyvH7tS1lnU54/values/inscriptions!A1:K1:append?valueInputOption=RAW&key=AIzaSyAKkzvBdhB0WRBJpZfNoG7KLfA1ye3uues',
    //   // method: 'get',
    //   // url: 'https://sheets.googleapis.com/v4/spreadsheets/1mog4J4TFeHvYir5qVDfHhyGpDjmUt9QyvH7tS1lnU54/values/inscriptions!A1:K1?key=AIzaSyAKkzvBdhB0WRBJpZfNoG7KLfA1ye3uues',
    //   data: JSON.stringify({
    //       "range": "inscriptions!A1:K1",
    //       "majorDimension": "ROWS",
    //       "values": exportData,
    //     }
    //
    //   ),
    //   // headers: {
    //   //   Authorization: 'Bearer ' + 'ya29.GltwBDoYN9masayiAB9j8vCbtnoj_pe7RdClUruB-zeE_U-SGBzBym00XnhrvwxRF5SqgUF3CTbsxsdmvLKbl6hAgRKwHx4bLp5zDugWXmtLFR0RJuXwj9bpzOte'
    //   // },
    //   contentType: 'application/json'
    // }).done(function(data) {
    //   console.log(data);
    //   this.trigger('inscription_done', this.days);
    // }.bind(this));
    this.user.horadateur = new Date();
    $.ajax({
      url: "https://api.mlab.com/api/1/databases/campclimat2017/collections/inscriptionpersonne?apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI",
      data: JSON.stringify(this.user),
      type: "POST",
      contentType: "application/json"
    }).done(function(data) {
      $.ajax({
        url: "https://api.mlab.com/api/1/databases/campclimat2017/collections/inscriptionplage?apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI",
        data: JSON.stringify(exportData),
        type: "POST",
        contentType: "application/json"
      }).done(function(data) {
        //console.log(data);
        this.trigger('inscription_done');
      }.bind(this));
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

  this.resctrictDate = function() {
    return sift({
      $and: [{
          date: {
            $gte: this.user.dateDebut
          }
        },
        {
          date: {
            $lte: this.user.dateFin
          }
        }
      ]
    }, this.days)
  }

  this.on('more_info', function(slot) {
    sift({id:slot.id},this.slots).forEach(record=>record.moreInfo=!record.moreInfo);
    this.trigger(this.resctrictDate());
  });

  this.on('slots_init', function() {
    var slotRequest = this.makeRequest("11iOoq00Hy8vMHDksubOUUDXvgf5YD1qz_-cUJlWDScE#gid=1048305501", "select A,B,C,D,E,F,G,L,H,I,J,K,M order by C asc, H asc", 0);
    var formationRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=0", "select A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q", 0);
    var lieuRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=453023377", "select A,F,I", 0);
    Promise.all([slotRequest, formationRequest, lieuRequest]).then(multiData => {
      this.slots = multiData[0].data;
      console.log(multiData[1],multiData[2]);
      var id = 1;
      for (slot of this.slots) {
        slot.id = id;
        slot.formation = sift({
          A: slot.A
        }, multiData[1].data)[0];
        slot.lieu = sift({
          A: slot.F
        }, multiData[2].data)[0];
        id++;
      }
      var slotsForRequest = this.slots.slice(0);
      //console.log(sift);
      this.days = [];
      for (slot of this.slots) {
        //slot.checked = false;
        slot.disallow = false;
        slot.booked = false;
        slot.date = eval('new ' + slot.C);
        slot.dateDisplay = ("0" + slot.date.getDate()).slice(-2) + '/' + ("0" + (slot.date.getMonth() + 1)).slice(-2) + '/' + slot.date.getFullYear();
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
      this.trigger('days_changed', this.resctrictDate(this.days));
    });
    //this.makeRequest("11iOoq00Hy8vMHDksubOUUDXvgf5YD1qz_-cUJlWDScE#gid=1048305501", "select A,B,C,D,E,F,G,L,H,I,J,K,M order by C asc, H asc", 0).then(sheet => {
    // this.slots = sheet.data;
    // var id = 1;
    // for (slot of this.slots) {
    //   slot.id = id;
    //   id++;
    // }
    // var slotsForRequest = this.slots.slice(0);
    // //console.log(sift);
    // this.days = [];
    // for (slot of this.slots) {
    //   //slot.checked = false;
    //   slot.disallow = false;
    //   slot.booked = false;
    //   slot.date = eval('new ' + slot.C);
    //   slot.dateDisplay = ("0" + slot.date.getDate()).slice(-2) + '/' + ("0" + (slot.date.getMonth() + 1)).slice(-2) + '/' + slot.date.getFullYear();
    //   slot.dayTimeDebut = slot.H * 60 + slot.I;
    //   slot.dayTimeFin = slot.J * 60 + slot.K;
    //   if (slot.L != undefined) {
    //     slot.mainSlots = sift({
    //       B: slot.B,
    //       D: {
    //         $ne: slot.D
    //       },
    //       L: {
    //         $exists: false
    //       }
    //     }, slotsForRequest)
    //   } else {
    //     slot.otherSlots = sift({
    //       B: slot.B,
    //       D: {
    //         $ne: slot.D
    //       },
    //       L: {
    //         $exists: true
    //       }
    //     }, slotsForRequest);
    //   }
    // }
    // for (slot of this.slots) {
    //   var currentDay = {};
    //   var dayExist = false;
    //   for (day of this.days) {
    //     //console.log(day.date,slot.date);
    //     if (day.date.getTime() == slot.date.getTime()) {
    //       dayExist = true;
    //       day.slots.push(slot);
    //       //currentDay= day;
    //       break;
    //     }
    //   }
    //   if (!dayExist) {
    //     //console.log(slot.date);
    //     this.days.push({
    //       date: slot.date,
    //       slots: [slot]
    //     });
    //     //currentDay=days[days.length-1];
    //   }
    // }
    // this.trigger('days_changed', this.resctrictDate(this.days));
    //})
  });

}
