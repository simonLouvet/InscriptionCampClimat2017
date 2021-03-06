function MainStore() {

  riot.observable(this) // Riot provides our event emitter.

  this.warningMessages = [];
  this.blockingMessages = [];

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

  this.makeRequestMlab = function(collection, methode, options, dataIn) {
    return new Promise((resolve, reject) => {
      var params = '';
      for (var paramKey in options) {
        params += paramKey + '=';
        params += JSON.stringify(options[paramKey]);
        params += '&'
      };
      $.ajax({
        url: 'https://api.mlab.com/api/1/databases/campclimat2017/collections/' + collection + '/?' + params + 'apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI',
        data: JSON.stringify(dataIn),
        type: methode,
        contentType: "application/json"
      }).done(function(data) {
        resolve(data);
      });
    });
  };

  this.disAllowSameTime = function(slotToDisallow, booked, disallow, depth, cause) {
    if (depth < 4) {
      //console.log(slotToDisallow.B, cause, slotToDisallow.dateDisplay, booked, disallow);
    }
    //if ((slotToDisallow.booked == false && slotToDisallow.disallow != disallow) || (booked != undefined && slotToDisallow.booked != booked)) {
    if (true) {

      var treeConsoleDethText = ''
      for (var treeConsoleDeth = 0; treeConsoleDeth <= depth; treeConsoleDeth++) {
        treeConsoleDethText += '--';
      }
      console.log(treeConsoleDethText, slotToDisallow.B, slotToDisallow.dateDisplay, slotToDisallow.D, cause, booked, disallow, depth);


      if (booked != undefined) {
        slotToDisallow.booked = booked;
      }
      if (slotToDisallow.causes == undefined) {
        slotToDisallow.causes = [];
      }
      if (cause != 'checked') {
        if (disallow == true) {
          slotToDisallow.causes.push(cause);
        } else if (disallow == false) {
          //console.log(slotToDisallow.causes.lastIndexOf(cause));
          var index = slotToDisallow.causes.lastIndexOf(cause)
          slotToDisallow.causes.splice(index, 1);
        }
      }

      //console.log(slotToDisallow.causes);

      //if (slotToDisallow.booked != true) {
      if (slotToDisallow.causes.length == 0) {
        slotToDisallow.disallow = false;
      } else {
        slotToDisallow.disallow = true;
      }

      //}

      if (booked != undefined) {
        slotToDisallow.booked = booked;
        //console.log('sametime check');
        sift({
          $and: [{
              id: {
                $ne: slotToDisallow.id
              }
            },
            // {
            //   booked: false
            // },
            {
              date: slotToDisallow.date
            },
            {
              full: {
                $ne: true
              }
            }, {
              $or: [{
                $and: [{
                  dayTimeDebut: {
                    $lt: slotToDisallow.dayTimeFin
                  }
                }, {
                  dayTimeFin: {
                    $gt: slotToDisallow.dayTimeDebut
                  }
                }]
              }]
            }
          ]
        }, this.slots).forEach(slot => {
          // if (booked == false) {
          //   var controlSlots = sift({
          //       $and: [{
          //           id: {
          //             $ne: slot.id
          //           }
          //         },
          //         {
          //           booked: true
          //         },
          //         {
          //           date: slot.date
          //         },
          //         {
          //
          //           $and: [{
          //             dayTimeDebut: {
          //               $lt: slot.dayTimeFin
          //             }
          //           }, {
          //             dayTimeFin: {
          //               $gt: slot.dayTimeDebut
          //             }
          //           }]
          //         }
          //       ]
          //     },
          //     this.slots);
          //   if (controlSlots.length == 0) {
          //     this.disAllowSameTime(slot, undefined, booked, depth + 1, 'sametime')
          //   }
          // } else {
          this.disAllowSameTime(slot, undefined, booked, depth + 1, 'sametime')
          // }
        });
      }


      // } else {
      //   slotToDisallow.disallow = disallow;
      // }

      //console.log(slotToDisallow);
      if (cause != 'main') {
        if (slotToDisallow.otherSlots != undefined && slotToDisallow.otherSlots.length > 0) {
          slotToDisallow.otherSlots.forEach(slot => {
            this.disAllowSameTime(slot, booked, disallow, depth + 1, 'others')
          });
        }
      }
      if (cause != 'others') {
        if (slotToDisallow.mainSlots != undefined && slotToDisallow.mainSlots.length > 0) {
          slotToDisallow.mainSlots.forEach(slot => {
            //console.log('master',slot);
            this.disAllowSameTime(slot, booked, disallow, depth + 1, 'main')
          });
        }
      }
      if (booked != undefined) {
        //console.log('ALLO');
        if (slotToDisallow.sucessors != undefined && slotToDisallow.sucessors.length > 0) {
          //TODO ajouter la contreinte des suivants
          var sucessorsSlots = sift({
            'dependencies.B': slotToDisallow.A,
            timeDebut: {
              $gte: slotToDisallow.timeFin
            }
          }, this.slots);
          sucessorsSlots.forEach(sucessor => {
            //console.log('sucessor',sucessor);
            if (sucessor.full == false) {

              // if (booked == true) {
                var dependeciesOk = true;
                sucessor.dependencies.forEach(dependency => {
                  //TODO ajouter la contrainte les précedents
                  // console.log(dependency);
                  // sift({
                  //   A: dependency.B,
                  //   booked: true
                  // }, this.slots).forEach(d=>{
                  //   console.log(d.timeFin);
                  // });

                  var dependenciesSlots = sift({
                    A: dependency.B,
                    booked: true,
                    timeFin: {
                      $lte: sucessor.timeDebut
                    }
                  }, this.slots);
                  console.log(dependenciesSlots);
                  if (dependenciesSlots.length == 0) {
                    dependeciesOk = false;
                    //break;
                  }
                });
                // if (impact == true) {
                var everDisallowForSucessors = sucessor.causes.lastIndexOf('sucessors')!=-1;
                console.log('sucessors change',sucessor,dependeciesOk,everDisallowForSucessors);
                if(everDisallowForSucessors==dependeciesOk){

                  this.disAllowSameTime(sucessor, undefined, !dependeciesOk, depth + 1, 'sucessors')
                }
                // }
              // } else {
              //   this.disAllowSameTime(sucessor, false, true, depth + 1, 'sucessors')
              // }
            }

          })
        }
      }
    }
  }

  this.on('switch_cursus', function(curus, checked) {
    //console.log('switch_cursus');
    sift({
      "curus.B": curus.A
    }, this.slots).forEach(slot => {

      if (checked == true) {
        slot.cursusBindingCauses.push(curus.A);
      } else if (checked == false) {
        //console.log(slotToDisallow.causes.lastIndexOf(cause));
        var index = slot.cursusBindingCauses.lastIndexOf(curus.A)
        slot.cursusBindingCauses.splice(index, 1);
      }
      if (slot.cursusBindingCauses.length > 0) {
        slot.curususBinding = true;
        slot.cursusBindingCausesText = "";
        for (causes of slot.cursusBindingCauses) {
          if (slot.cursusBindingCausesText.length > 0) {
            slot.cursusBindingCausesText += ', '
          }
          slot.cursusBindingCausesText += causes;
        }
      } else {
        slot.curususBinding = false;
      }
      console.log('switch_cursus', slot);
    });
    this.trigger('days_changed', this.restrictDate(this.days));

  });

  this.on('switch_select', function(slot, checked) {
    sift({
      id: slot.id
    }, this.slots).forEach(slot => {
      slot.checked = checked;
      //slot.booked = checked;
      this.disAllowSameTime(slot, checked, undefined, 0, 'checked')
    });
    this.trigger('days_changed', this.restrictDate(this.days));
    this.checkForMessage();
  });

  this.on('comment_change', function(value) {
    this.user.comment = value;
  });

  this.checkForMessage = function() {
    this.warningMessages = [];
    this.blockingMessages = [];

    //console.log(this.domaines);

    this.domaines.forEach(domaine => {
      var minBookslots = sift({
        $and: [{
          G: domaine.A
        }, {
          booked: true
        }]
      }, this.slots);
      //if (domaine.C > 0) {
      //var nbDay = (this.user.dateFin - this.user.dateDebut) / (60 * 60 * 24 * 1000);
      var nbDay = this.resctrictDays.length;
      //console.log(nbDay, domaine.minInscriptions);
      if (domaine.minInscriptions.length > 0) {
        minInscriptions = sift({
          $and: [{
              minDay: {
                $lte: nbDay
              }
            },
            {
              $or: [{
                maxDay: {
                  $gte: nbDay
                }
              }, {
                maxDay: {
                  $exists: false
                }
              }]
            }
          ]
        }, domaine.minInscriptions);
        //console.log(domaine, minInscriptions, minBookslots.length);
        if (minInscriptions[0] != undefined && minInscriptions[0].C > minBookslots.length) {
          this.warningMessages.push({
            message: 'domaine',
            data: {
              domaine: domaine,
              minInscription: minInscriptions[0]
            }
          });
        }


      }
      // if(minBookslots.length<domaine.C){
      //   this.blockingMessages.push({
      //     message: 'domaine',
      //     data: domaine
      //   });
      // }
      //  }
    })

    var mandatoryNotComplete = sift({
      $and: [{
          M: {
            $exists: true
          }
        },
        {
          booked: {
            $exists: false
          }
        },
        {
          L: {
            $exists: false
          }
        },
        {
          disallow: false
        },
        {
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
    }, this.slots);
    // var mandatoryNotComplete = sift({
    //   $and: [
    //     {
    //       disallow: false
    //     }
    //   ]
    // }, this.slots);
    //console.log(mandatoryNotComplete);
    mandatoryNotComplete.forEach(slot => {
      //this.blockingMessages.push('vous devez obligatoirement répondre concernant votre présence à la formation ' + slot.formation.A + ' qui se déroule le ' + slot.dateDisplay);
      this.blockingMessages.push({
        message: 'mandatory',
        data: slot
      });
    });

    this.trigger('messages_changed', this.warningMessages, this.blockingMessages);
  }


  this.on('email_change', function(email) {
    if (email != undefined) {
      var oldUserRequest = this.makeRequestMlab('inscriptionpersonne', 'GET', {
        q: {
          D: email
        }
      });
      var initialUserBooking = this.makeRequest("1aJXvBugaH0ejrPaKQcEX1YeEW8hCrM8ctEeuwqEPNJs#gid=2008365008", "select B,C,D,J,L where lower(D)='" + email.toLowerCase() + "'", 0);
      Promise.all([initialUserBooking, oldUserRequest]).then(multiData => {
        //console.log(multiData);
        /*var userFinded = sift({
          D: email
        }, multiData[0].data);*/
        console.log(multiData[0].data);
        var userFinded = multiData[0].data;


        this.oldUser = multiData[1][0];
        this.oldUserRecords = multiData[1];

        if (userFinded.length > 0) {
          this.user = userFinded[0];
          this.user.D = this.user.D.toLowerCase();
          if (this.oldUser != undefined) {
            this.user.dateDebut = new Date(this.oldUser.dateDebut);
          } else {
            this.user.dateDebut = eval('new ' + this.user.J);
          }
          this.user.dateDebutInputValue = ("0" + this.user.dateDebut.getDate()).slice(-2) + '/' + ("0" + (this.user.dateDebut.getMonth() + 1)).slice(-2) + '/' + this.user.dateDebut.getFullYear();
          if (this.oldUser != undefined) {
            this.user.dateFin = new Date(this.oldUser.dateFin);
          } else {
            this.user.dateFin = eval('new ' + this.user.L);
          }
          if (this.oldUser != undefined) {
            this.user.comment = this.oldUser.comment;
          }

          this.user.dateFinInputValue = ("0" + this.user.dateFin.getDate()).slice(-2) + '/' + ("0" + (this.user.dateFin.getMonth() + 1)).slice(-2) + '/' + this.user.dateFin.getFullYear();
          //console.log(this.user);
          this.trigger('user_connected', this.user);
          this.trigger('slots_init');
        } else {
          this.trigger('user_not_connected');
        }
      });
    }
  });

  this.on('dateDebut_change', function(date, str) {
    console.log(date);
    this.user.dateDebut = date;
    this.user.dateDebutInputValue = str;
    this.trigger('days_changed', this.restrictDate(this.days));
    this.checkForMessage();
  });

  this.on('dateFin_change', function(date, str) {
    //console.log(date);
    this.user.dateFin = date;
    this.user.dateFinInputValue = str;
    this.trigger('days_changed', this.restrictDate(this.days));
    this.checkForMessage();
  });

  this.on('persist_slots', function() {
    var exportData = [];
    var horodateur = new Date();
    sift({
      $or: [{
          checked: {
            $exists: true
          }
        },
        {
          booked: true
        }
      ]
    }, this.slots).forEach(slot => {
      exportData.push({
        horadateur: horodateur,
        checked: slot.checked,
        booked: slot.booked,
        email: this.user.D,
        formation: slot.A,
        session: slot.B,
        dateDisplay: slot.dateDisplay,
        date: slot.date,
        Hdebut: slot.D,
        Hfin: slot.E
      });
    });

    this.user.horadateur = horodateur;




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
        this.oldBookings.forEach(oldBooking => {
          $.ajax({
            url: "https://api.mlab.com/api/1/databases/campclimat2017/collections/inscriptionplage/" + oldBooking._id.$oid + "?apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI",
            type: "DELETE",
            contentType: "application/json"
          }).done(function(data) {});
        });
        this.oldUserRecords.forEach(oldUserRecord=>{
          $.ajax({
            url: "https://api.mlab.com/api/1/databases/campclimat2017/collections/inscriptionpersonne/" + oldUserRecord._id.$oid + "?apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI",
            type: "DELETE",
            contentType: "application/json"
          }).done(function(data) {});
        });
        // if (this.oldUser != undefined) {
        //   $.ajax({
        //     url: "https://api.mlab.com/api/1/databases/campclimat2017/collections/inscriptionpersonne/" + this.oldUser._id.$oid + "?apiKey=ue_eHVRDWSW0r2YZuTLCi1BxVB_zXnOI",
        //     type: "DELETE",
        //     contentType: "application/json"
        //   }).done(function(data) {});
        // }

        this.trigger('inscription_done');
      }.bind(this));
    }.bind(this));

  });



  this.restrictDate = function() {
    sift({
      $or: [{
          date: {
            $lt: this.user.dateDebut
          }
        },
        {
          date: {
            $gt: this.user.dateFin
          }
        }
      ]
    }, this.slots).forEach(slot => {
      slot.booked = undefined;
      slot.checked = undefined;
    });
    this.resctrictDays = sift({
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
    }, this.days);
    return this.resctrictDays;
  }

  this.on('more_info', function(slot) {
    sift({
      id: slot.id
    }, this.slots).forEach(record => record.moreInfo = !record.moreInfo);
    this.trigger('days_changed', this.restrictDate());
  });

  this.on('slots_init', function() {
    var slotRequest = this.makeRequest("11iOoq00Hy8vMHDksubOUUDXvgf5YD1qz_-cUJlWDScE#gid=1048305501", "select A,B,C,D,E,F,G,L,H,I,J,K,M,N order by C asc, H asc", 0);
    var formationRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=0", "select A,F,G", 0);
    var lieuRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=453023377", "select A,F,I", 0);
    var bookingRequest = this.makeRequestMlab('inscriptionplage', 'GET', {
      l: 20000,
      s: {
        checked: 1
      },
      f: {
        checked: 1,
        session: 1,
        email: 1,
        _id: 1
      }
    });
    var dependenciesRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=507094044", "select A,B", 0);
    var domainesRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=1820632004", "select A,B,C", 0);
    var minInscriptionRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=108206282", "select A,B,C order by B asc", 0);
    var cursusRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=1179905021", "select A,B", 1);
    var cursusFormationRequest = this.makeRequest("1cXMAFbMIAFDkT_hLN0DcfPAzww41d_xzyGziy5UzrfE#gid=834841764", "select A,B", 0);

    Promise.all([slotRequest, formationRequest, lieuRequest, bookingRequest, dependenciesRequest, domainesRequest, minInscriptionRequest, cursusRequest, cursusFormationRequest]).then(multiData => {

      this.cursus = multiData[7].data;
      this.trigger('cursus_changed', this.cursus);

      this.domaines = multiData[5].data;
      this.domaines.forEach(domaine => {
        var minInscriptions = sift({
          A: domaine.A
        }, multiData[6].data);
        var prevMinInsc;
        for (minInscription of minInscriptions) {
          if (prevMinInsc != undefined) {
            prevMinInsc.maxDay = minInscription.B - 1;
          }
          minInscription.minDay = minInscription.B;
          prevMinInsc = minInscription;
        }
        domaine.minInscriptions = minInscriptions;
      });
      this.slots = multiData[0].data;
      console.log(multiData);
      var id = 1;
      for (slot of this.slots) {
        slot.id = id;
        slot.formation = sift({
          A: slot.A
        }, multiData[1].data)[0];
        slot.lieu = sift({
          A: slot.F
        }, multiData[2].data)[0];
        slot.dependencies = sift({
          A: slot.A
        }, multiData[4].data);
        slot.sucessors = sift({
          B: slot.A
        }, multiData[4].data);
        slot.curus = sift({
          A: slot.A
        }, multiData[8].data);
        slot.cursusBindingCauses = [];
        //console.log(slot.dependances);

        id++;
      }
      var slotsForRequest = this.slots.slice(0);
      //console.log(sift);
      this.days = [];
      for (slot of this.slots) {
        //slot.checked = false;

        //slot.booked = false;
        slot.date = eval('new ' + slot.C);
        slot.dateDisplay = ("0" + slot.date.getDate()).slice(-2) + '/' + ("0" + (slot.date.getMonth() + 1)).slice(-2) + '/' + slot.date.getFullYear();
        slot.dayTimeDebut = slot.H * 60 + slot.I;
        slot.dayTimeFin = slot.J * 60 + slot.K;
        slot.timeDebut = slot.date.getTime() + (slot.dayTimeDebut * 60*1000);
        slot.timeFin = slot.date.getTime() + (slot.dayTimeFin * 60*1000);
        slot.disallow = false;
        if (slot.dependencies.length > 0) {
          slot.disallow = true;
          slot.causes = ['sucessors'];
        }

        if (slot.L != undefined) {
          slot.mainSlots = sift({
            B: slot.B,
            L: {
              $exists: false
            }
          }, slotsForRequest)
        } else {
          slot.otherSlots = sift({
            B: slot.B,
            L: {
              $exists: true
            }
          }, slotsForRequest);
        };
        //console.log(slot);
        slot.jauge = Math.min(slot.N, slot.lieu.F);
        slot.reservation = sift({

          $and: [{
            checked: true
          }, {
            session: slot.B
          }]
        }, multiData[3]).length;
        if (slot.reservation >= slot.jauge) {
          slot.disallow = true;
          slot.full = true;
        } else {
          slot.full = false;
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

      var bookingsForUser = sift({
        email: this.user.D
      }, multiData[3]);
      this.oldBookings = bookingsForUser;
      if (bookingsForUser.length > 0) {
        this.user.overwrite = true;
      }
      console.log('bookingsForUser', bookingsForUser);
      var bookingsForUserBinding = sift({
        checked: {
          $exists: true
        }
      }, bookingsForUser);
      console.log('bookingsForUserBinding', bookingsForUserBinding);
      bookingsForUserBinding.forEach(booking => {
        var slot = sift({
          $and: [{
            mainSlots: {
              $exists: false
            }
          }, {
            B: booking.session
          }]
        }, this.slots);
        if (slot.length > 0) {
          slot[0].checked = booking.checked;
          slot[0].oldId=booking._id.$oid;
          //slot.booked = checked;
          this.disAllowSameTime(slot[0], booking.checked, undefined, 0, 'checked')
          //this.trigger('switch_select', slot[0], booking.checked);
        }

      });
      //console.log(this.days);
      this.trigger('days_changed', this.restrictDate(this.days));
      this.checkForMessage();
    });

  });

}
