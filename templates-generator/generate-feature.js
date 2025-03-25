const fs = require('fs');
const path = require('path');

// Базовая структура
const structure = [
  'api/input-dto/{{kebabCase name}}-query-params.input-dto.ts',
  'api/input-dto/create-{{singularize(kebabCase(name))}}.input-dto.ts',
  'api/input-dto/update-{{singularize(kebabCase(name))}}.input-dto.ts',
  'api/input-dto/{{kebabCase name}}-sort-by.ts',
  'api/view-dto/{{singularize(kebabCase(name))}}.view-dto.ts',
  'api/validation',
  'api/{{kebabCase name}}.controller.ts',
  'application/queries/get-{{singularize(kebabCase(name))}}-by-id.query-handler.ts',
  'application/queries/get-{{kebabCase name}}.query-handler.ts',
  'application/usecases/create-{{singularize(kebabCase(name))}}.usecase.ts',
  'application/usecases/delete-{{singularize(kebabCase(name))}}.usecase.ts',
  'application/usecases/update-{{singularize(kebabCase(name))}}.usecase.ts',
  'constants',
  'dto/{{singularize(kebabCase(name))}}.dto.ts',
  'domain/{{singularize(kebabCase(name))}}.entity.ts',
  'infrastructure/query/{{kebabCase name}}.query-repository.ts',
  'infrastructure/{{kebabCase name}}.repository.ts',
  '{{kebabCase name}}.module.ts',
];

const apiDtoTemplates = require('./templates/api-dto-templates');
const apiControllers = require('./templates/api-controllers');
const queryHandlers = require('./templates/app-query-handlers');
const usecases = require('./templates/app-usecases');
const domain = require('./templates/domain');
const repository = require('./templates/repository');
const queryRepository = require('./templates/query-repository');
const moduleTemplate = require('./templates/module');

// Функции для преобразования имени
const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('./utils');

// Заглушки классов
const fileTemplates = {
  ...apiDtoTemplates,
  ...apiControllers,
  ...queryHandlers,
  ...usecases,
  ...domain,
  ...repository,
  ...queryRepository,
  ...moduleTemplate,
};

// Создание файлов и директорий
function createFeature(name, baseDir = 'src/modules') {
  const featureDir = path.join(baseDir, name);
  structure.forEach((relativePath) => {
    const processedPath = relativePath
      .replace(/\{\{kebabCase name\}\}/g, kebabCase(name))
      .replace(
        /\{\{singularize\(kebabCase\(name\)\)\}\}/g,
        singularize(kebabCase(name)),
      );
    const fullPath = path.join(featureDir, processedPath);
    const dirPath = path.dirname(fullPath);

    // Создаем директорию, если её нет
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Если это файл, создаем его с заглушкой
    if (path.extname(fullPath)) {
      const templateKey = Object.keys(fileTemplates).find((key) => {
        const pattern = new RegExp(key.replace('*', '[^/]+') + '$');
        return pattern.test(processedPath);
      });

      const content = fileTemplates[templateKey]
        ? fileTemplates[templateKey](name)
        : '';

      fs.writeFileSync(fullPath, content);
    }
  });

  console.log(`Feature "${name}" created successfully in ${featureDir}`);
}

// Генерация новой фичи
const featureName = process.argv[2]; // Имя фичи передается как аргумент командной строки
if (!featureName) {
  console.error('Please provide a feature name.');
  process.exit(1);
}

createFeature(featureName);
