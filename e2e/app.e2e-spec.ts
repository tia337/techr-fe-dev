import { SwipeinPage } from './app.po';

describe('swipein App', () => {
  let page: SwipeinPage;

  beforeEach(() => {
    page = new SwipeinPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
