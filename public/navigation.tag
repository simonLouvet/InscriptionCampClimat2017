<navigation>
  <div class="containerV">

    <div >
      <label>email</label>
    </div>
    <div class="containerH">
      <div>
        <input type="texte" onchange={emailchange}></input>
      </div>

    </div>
    <div style="flex-grow:1;justify-content:center" class="button containerH" onclick={mailValidation} if={days==undefined}>
      <div >
        <div>
          vérifier que je suis bien inscrit au camp climat
        </div>
        <div>
          et commencer mes inscriptions aux activités
        </div>
      </div>
    </div>
    <div if={days!=undefined}>
      <div >
        <label>confirmer votre date date d'arrivée</label>
      </div>
      <div>
        <input type="date"></input>
      </div>
    </div>
    <div if={days!=undefined}>
      <div >
        <label>confirmer votre date date de départ</label>
      </div>
      <div>
        <input type="date"></input>
      </div>
    </div>
    <div if={days!=undefined}>
      <div >
        <label>Vous avez déjà fourni les autres informations dans le formulaire d'inscription mais vous pouvez nous laisser un commentaire ou des informations utiles</label>
      </div>
      <div>
        <textarea></textarea>
      </div>
    </div>
    <div if={days!=undefined}>
      <div>
        <label>Pour faciliter la saisie de l'inscription, vous pouvez preselectionner les cursus qui vous interessent. Les formations de ces cursus vous seront indiqués</label>
      </div>
      <div>
        <H1>EN TRAVAUX</H1>
      </div>
    </div>

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
            <div style="flex-basis:40px">
              <input type="checkbox" if={L==undefined && !disallow} onchange={changeSelect}></input>
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
  <div class="containerH" style="justify-content:center" if={days!=undefined}>
    <div style="flex-basis:60%;justify-content:center" class="button containerH" onclick={persistSlots}>
      <div >
        valider
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

    this.on('mount', function () {
      //RiotControl.trigger('slots_init'); this.update();
    });

    RiotControl.on('days_changed', function (data) {
      console.log(data);
      this.days = data;
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

  </style>
</navigation>
