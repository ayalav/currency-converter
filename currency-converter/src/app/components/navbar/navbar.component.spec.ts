import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe ('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule], // מאפשר בדיקות ניווט
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement; // ה-DOM של הקומפוננטה
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // וידוא שהקומפוננטה נוצרה בהצלחה
  });

  it('should display the logo', () => {
    const logo = compiled.querySelector('.logo'); // מוצאים את האלמנט של הלוגו
    expect(logo?.textContent).toContain('💱 Currency App'); // וידוא שהטקסט מכיל את הלוגו
  });

  it('should display the menu button only on small screens', () => {
    const menuButton = compiled.querySelector('.menu-button') as HTMLElement;

    // בדיקה בגודל מסך קטן
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(menuButton.style.display).not.toBe('none'); // הכפתור צריך להופיע

    // בדיקה בגודל מסך גדול
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(menuButton.style.display).toBe('none'); // הכפתור לא אמור להופיע
  });

  it('should open the menu on small screens when button is clicked', () => {
    const menuButton = compiled.querySelector('.menu-button') as HTMLElement;

    // שינוי גודל מסך קטן
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    // לחיצה על כפתור התפריט
    menuButton.click();
    fixture.detectChanges();

    const links = compiled.querySelector('.links');
    expect(links?.classList).toContain('open'); // וידוא שהתפריט נפתח
  });

  it('should navigate to all links correctly', () => {
    const links = compiled.querySelectorAll('a'); // כל הקישורים בתפריט
    const linkTexts = ['Currency Converter', 'History', 'Chart'];

    expect(links.length).toBe(linkTexts.length); // בדיקה שכל הקישורים קיימים

    links.forEach((link, index) => {
      const anchor = link as HTMLAnchorElement;
      expect(anchor.textContent).toContain(linkTexts[index]); // וידוא שהטקסט נכון
    });
  });
});
