import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  currentYear: number = new Date().getFullYear();

  activeTab = signal<string>('prq');

  features = [
    { 
      id: 'prq', 
      title: 'Purchase Requests', 
      desc: 'Smart, multi-line request forms.',
      image: '/assets/images/PRQ.png' 
    },
    { 
      id: 'po', 
      title: 'Purchase Orders', 
      desc: 'One-click automated PO generation.',
      image: '/assets/images/PO.png' 
    },
    { 
      id: 'vendor', 
      title: 'Vendor Hub', 
      desc: 'Manage all suppliers in one place.',
      image: '/assets/images/Vendor.png' 
    },
    { 
      id: 'user', 
      title: 'Access Control', 
      desc: 'Strict PBAC and user roles.',
      image: '/assets/images/User.png' 
    }
  ];
}
