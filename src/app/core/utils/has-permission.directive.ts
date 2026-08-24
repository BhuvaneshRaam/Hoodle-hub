import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  constructor() { }

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  @Input() set appHasPermission(permissionString: string) {
    const [moduleName, privilegeName] = permissionString.split('.');
    
    const hasAccess = this.authService.hasAccess(moduleName, privilegeName);

    this.viewContainer.clear();

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
