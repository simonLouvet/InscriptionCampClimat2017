<navigation>
  <div class="containerV">

    <div class="containerH">
      <div style="flex-basis:25%">
        <div>
          <label>email</label>
        </div>
        <div>
          <input type="texte" onchange={emailchange} style="width:100%"></input>
        </div>
      </div>

      <div style="flex-basis:70%" if={notConnected} class="notConnected">
        <span>
          Ce mail ne correspond à aucun mail fournis par les personnes qui se sont inscrites au camp climat. Vous ne pouvez donc pas vous inscrire aux activités
        </span>
      </div>
    </div>
    <div style="flex-grow:1;justify-content:center" class="button containerH" onclick={mailValidation} if={days==undefined}>
      <div class="containerV">
        <div>
          vérifier que je suis bien inscrit au camp climat
        </div>
        <div>
          et commencer mes inscriptions aux activités
        </div>
      </div>
    </div>
    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div >
          <label>confirmer votre date date d'arrivée</label>
        </div>
        <div>
          <input type="text" value={userConnected.dateDebutInputValue} name="dateDebut" id="dateDebut"></input>
        </div>
      </div>
    </div>
    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div >
          <label>confirmer votre date date de départ</label>
        </div>
        <div>
          <input type="text" value={userConnected.dateFinInputValue} name="dateFin" id="dateFin"></input>
        </div>
      </div>
    </div>
    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div >
          <label>Vous avez déjà fourni les autres informations dans le formulaire d'inscription mais vous pouvez nous laisser un commentaire ou des informations utiles</label>
        </div>
        <div>
          <textarea style="width:100%"></textarea>
        </div>
      </div>
    </div>
    <!--<div if={days!=undefined}>
      <div>
        <label>Pour faciliter la saisie de l'inscription, vous pouvez preselectionner les cursus qui vous interessent. Les formations de ces cursus vous seront indiqués</label>
      </div>
      <div>
        <H1>EN TRAVAUX</H1>
      </div>
    </div>-->

  </div>
  <div class="containerV booking">
    <div each={days} classe="day">
      <div class="containerH sectionHeader" style="justify-content:center">
        <div>
          {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]}
        </div>
      </div>
      <div class="containerV">
        <div each={slots} class={booked:booked, disallow:disallow,slot:true}>
          <div class="containerH">
            <div style="flex-basis:60px" >
              <input type="checkbox" onchange={changeSelect} if={L==undefined && !disallow && M==undefined} checked={checked}></input>
              <div class="containerH" if={L==undefined && !disallow && M!=undefined}> <input type="radio" name="mand-{id}" value="true"  onchange={changeRadio} checked={checked==true}><span>oui</span></div>
              <div class="containerH" if={L==undefined && !disallow && M!=undefined}> <input type="radio" name="mand-{id}" value="false" onchange={changeRadio} checked={checked==false}><span>non</span></div>
            </div>
            <div style="flex-basis:80px">
              {D}
            </div>
            <div style="flex-basis:80px">
              {E}
            </div>
            <div style="flex-basis:300px">
              {G}
            </div>
            <div>
              {A}
            </div>
          </div>
          <div class="containerH" if={otherSlots!=undefined && otherSlots.length>0}>
            <div>
              cette formation bloque ces autres créneaux :
            </div>
            <div each={otherSlots} class="colSpanRow">
              {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {D} à {E}
            </div </div>
          </div>
          <div class="containerH" if={mainSlots!=undefined && mainSlots.length>0}>
            <div>
              pour s'inscrire à cette formation, vous devez vous inscrire le :
            </div>
            <div each={mainSlots} class="colSpanRow">
              {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {D} à {E}
            </div </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="containerH" style="justify-content:center" if={days!=undefined && !inscriptionDone}>
    <div style="flex-basis:60%;justify-content:center" class="button containerH" onclick={persistSlots}>
      <div >
        valider
      </div>
    </div>
  </div>
  <div class="containerH" style="justify-content:center" if={inscriptionDone}>
    <div style="flex-basis:60%;justify-content:center" class="containerH" onclick={persistSlots}>
      <div >
        Votre inscription a bien été enregistrée avec les informations ci-dessuss
      </div>
    </div>
  </div>
  <script>
    this.weekDays = [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi'
    ];
    this.months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ];

    this.inscriptioDone = false;
    this.notConnected = false;

    this.on('mount', function () {
      //RiotControl.trigger('slots_init'); this.update();
    });
    this.on('update', function () {
      setTimeout(function () {
        // console.log($(".datePicker")); var param = {   firstDay: 1,   altField: ".datePicker",   closeText: 'Fermer',   prevText: 'Précédent',   nextText: 'Suivant',   currentText: 'Aujourd\'hui',   monthNames: [     'Janvier',     'Février',     'Mars',
        //  'Avril',     'Mai',     'Juin',     'Juillet',     'Août',     'Septembre',     'Octobre',     'Novembre',     'Décembre'   ],   monthNamesShort: [     'Janv.',     'Févr.',     'Mars',     'Avril',     'Mai',     'Juin',     'Juil.', 'Août',
        // 'Sept.',     'Oct.',     'Nov.',     'Déc.'   ],   dayNames: [     'Dimanche',     'Lundi',     'Mardi',     'Mercredi',     'Jeudi',     'Vendredi',     'Samedi'   ],   dayNamesShort: [     'Dim.',     'Lun.',     'Mar.',     'Mer.',    'Jeu.',
        //   'Ven.',     'Sam.'   ],   dayNamesMin: [     'D',     'L',     'M',     'M',     'J',     'V',     'S'   ],   weekHeader: 'Sem.',   dateFormat: 'dd/mm/yy',   onSelect: function (str, inst) {     var objectDate = new Date(inst.selectedYear,
        // inst.selectedMonth, inst.selectedDay);     if (inst.id == "dateDebut") {       //  RiotControl.trigger('dateDebut_change', objectDate,str);     }     if (inst.id == "dateFin") {       //RiotControl.trigger('dateFin_change', objectDate,str);     }
        //  }.bind(this) };
        $("#dateDebut").datepicker({
          firstDay: 1,
          altField: ".datePicker",
          closeText: 'Fermer',
          prevText: 'Précédent',
          nextText: 'Suivant',
          currentText: 'Aujourd\'hui',
          monthNames: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
          ],
          monthNamesShort: [
            'Janv.',
            'Févr.',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juil.',
            'Août',
            'Sept.',
            'Oct.',
            'Nov.',
            'Déc.'
          ],
          dayNames: [
            'Dimanche',
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi'
          ],
          dayNamesShort: [
            'Dim.',
            'Lun.',
            'Mar.',
            'Mer.',
            'Jeu.',
            'Ven.',
            'Sam.'
          ],
          dayNamesMin: [
            'D',
            'L',
            'M',
            'M',
            'J',
            'V',
            'S'
          ],
          weekHeader: 'Sem.',
          dateFormat: 'dd/mm/yy',
          onSelect: function (str, inst) {
            var objectDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

            RiotControl.trigger('dateDebut_change', objectDate, str);

          }.bind(this)
        });
        $("#dateFin").datepicker({
          firstDay: 1,
          altField: ".datePicker",
          closeText: 'Fermer',
          prevText: 'Précédent',
          nextText: 'Suivant',
          currentText: 'Aujourd\'hui',
          monthNames: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
          ],
          monthNamesShort: [
            'Janv.',
            'Févr.',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juil.',
            'Août',
            'Sept.',
            'Oct.',
            'Nov.',
            'Déc.'
          ],
          dayNames: [
            'Dimanche',
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi'
          ],
          dayNamesShort: [
            'Dim.',
            'Lun.',
            'Mar.',
            'Mer.',
            'Jeu.',
            'Ven.',
            'Sam.'
          ],
          dayNamesMin: [
            'D',
            'L',
            'M',
            'M',
            'J',
            'V',
            'S'
          ],
          weekHeader: 'Sem.',
          dateFormat: 'dd/mm/yy',
          onSelect: function (str, inst) {
            var objectDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

            RiotControl.trigger('dateFin_change', objectDate, str);

          }.bind(this)
        });
        // .on('change', function (e) {     //console.log("Date changed: ", e.target.value);     //alert($(this).val())     console.log($(this).val()); });
      }, 10);

    })

    RiotControl.on('days_changed', function (data) {
      console.log(data);
      this.days = data;
      this.update();
    }.bind(this))

    RiotControl.on('user_connected', function (data) {
      this.notConnected = false;
      this.userConnected = data;
      this.update();
    }.bind(this))

    RiotControl.on('user_not_connected', function (data) {
      this.notConnected = true;
      this.update();
    }.bind(this))

    RiotControl.on('inscription_done', function (data) {
      this.inscriptionDone = true;
      this.update();
    }.bind(this))

    changeSelect(e) {
      RiotControl.trigger('switch_select', e.item, e.target.checked);
    }

    persistSlots(e) {
      RiotControl.trigger('persist_slots');
    }

    emailchange(e) {
      this.email = e.target.value;
    }

    mailValidation(e) {
      RiotControl.trigger('email_change', this.email);
    }
  </script>
  <style>
    .slots {
      padding: 10px;
      display: table;
    }
    .row {
      display: table-row;
    }
    .row > * {
      display: table-cell;
      padding: 2px;
    }
    .booked {
      background-color: GreenYellow;
    }

    .disallow {
      color: grey;
    }

    .day {
      margin-top: 10px;
    }

    .sectionHeader {
      background-color: green;
      color: white;
    }
    .slot {
      border-bottom-style: solid;
      border-bottom-width: 1px;
    }

    .button {
      background-color: green;
      color: white;
      cursor: pointer;
      border-color: green;
      border-style: solid;
      border-width: 5px;
    }
    .button:hover {
      border-color: DarkGreen;
    }

    .booking {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .notConnected {
      background-color: DarkOrange;
      color: white;
    }

  </style>
</navigation>
