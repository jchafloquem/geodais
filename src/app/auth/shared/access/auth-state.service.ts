import { inject, Injectable } from '@angular/core';
import { GeovisorSharedService } from '../../../geovisor/services/geovisor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private _geovisorSharedService = inject(GeovisorSharedService);

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('redirectUrl');
    this._geovisorSharedService.resetMapState();
  }
}
