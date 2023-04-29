import { EmailTemplates } from '@aksesaja/mailer';
import handlebars from 'handlebars';

export class TemplateUtils {
  /**
   *
   * @param template
   * @param context
   */
  public static compile<T>(template: EmailTemplates, context: T): string {
    handlebars.registerHelper('isdefined', function (value) {
      if (value !== 'NONE') return value;
    });
    return handlebars.compile(template)(context);
  }
}
