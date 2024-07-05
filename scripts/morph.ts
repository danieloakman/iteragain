import { main } from 'js-utils';
import { join } from 'path';
import { Project } from 'ts-morph';

main(module, async () => {
  const project = new Project({
    tsConfigFilePath: join(__dirname, '../tsconfig.esm.json'),
  });

  const srcDir = join(__dirname, '../src');

  const file = project.getSourceFileOrThrow(join(srcDir, 'map.ts')).copy(join(srcDir, 'mapAsync.ts'));
  // file.getFunctionOrThrow('map').setIsAsync(true);
  for (const fn of file.getFunctions()) {
    fn.setIsAsync(true);
    for (const overload of fn.getOverloads()) {
      overload.setIsAsync(true);
      overload.setReturnType(writer => {
        const returnType = writer.toString();
        if (returnType.startsWith('Promise<')) {
          return returnType;
        }
      });
    }
  }
  await file.save();
  // await project.save();
  // file.print();
});
