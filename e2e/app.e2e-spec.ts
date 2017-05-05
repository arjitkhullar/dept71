import { Dept71Page } from './app.po';

describe('dept71 App', () => {
  let page: Dept71Page;

  beforeEach(() => {
    page = new Dept71Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
