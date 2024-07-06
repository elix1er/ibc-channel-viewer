import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/features/store';
import { Editor } from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CodeViewer() {
  const { data } = useSelector((state: RootState) => state.ibcInfo);
  return (
    <AnimatePresence>
      {data ? (
        <motion.div
          key="editor"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="">
            <CardHeader>
              <CardTitle>IBC Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                className="min-h-[50vh]"
                language="json"
                value={JSON.stringify(data, null, 2)}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  //   colorDecorators: true,
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
}
