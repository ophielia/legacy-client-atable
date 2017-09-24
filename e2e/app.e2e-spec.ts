import { ClientAtablePage } from './app.po';

describe('client-atable App', () => {
  let page: ClientAtablePage;

  beforeEach(() => {
    page = new ClientAtablePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
