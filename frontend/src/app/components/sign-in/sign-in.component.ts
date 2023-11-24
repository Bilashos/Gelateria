import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  registrazioneForm: FormGroup;

  constructor(private userService: UserService,
              private fb: FormBuilder) {
    this.registrazioneForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    console.log("Creazione Componente");
  }

  onSubmit() {
    if (this.registrazioneForm.valid) {
      // Puoi gestire l'invio del form qui
      console.log('Dati inviati:', this.registrazioneForm.value);
      var user = new User(this.registrazioneForm.value);
      console.log(user);
      this.userService.createUser(user)
        .subscribe(
          (result: any) => {
            console.log(result);
          },
          (error: any) => {
            // Gestisci l'errore qui senza loggare in console
            console.error("Errore durante la richiesta:", error);
            // Puoi anche gestire l'errore in modo più specifico, ad esempio mostrando un messaggio all'utente.
          }
        );
    }
  }
}
