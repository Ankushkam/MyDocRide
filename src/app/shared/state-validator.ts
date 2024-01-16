import { AbstractControl } from '@angular/forms'
import  States  from '../shared/states.json'

export class StateCheckValidator {
    static MatchState(control: AbstractControl) {
        let selectedState = control.get('state').value
        let state = States.filter(state => state.Code===selectedState)
        if (state.length > 0) {
            return null
        } 
        else {
            control.get('state').setErrors({ state : true })    
        }
    }
}