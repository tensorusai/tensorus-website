"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PlatformCodeExamples() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Code Examples</h2>
          <p className="text-xl text-muted-foreground">See how easy it is to work with Tensorus in your applications</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="basic" className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="ml">ML Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Basic Tensor Operations</h3>
                <pre className="text-xs md:text-sm overflow-x-auto bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono">
                  {`import numpy as np
from tensor_database import TensorDatabase

# Initialize the database
db = TensorDatabase(
    storage_path="my_first_db.h5",  # Where to store the data
    use_gpu=False                    # Start without GPU for simplicity
)

# Create a simple tensor (2D matrix)
data = np.array([
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0]
])

# Add some helpful information about the tensor
metadata = {
    "name": "first_matrix",
    "description": "A 2x3 matrix example",
    "created_by": "tutorial"
}

# Save the tensor to the database
tensor_id = db.save(data, metadata)
print(f"Saved tensor with ID: {tensor_id}")

# Retrieve the tensor
retrieved_tensor, meta = db.get(tensor_id)
print("Retrieved tensor shape:", retrieved_tensor.shape)
print("Metadata:", meta)

# Search for similar tensors
similar_tensors = db.search_similar(
    query_tensor=retrieved_tensor,
    k=5  # Find 5 most similar tensors
)`}
                </pre>
              </motion.div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Advanced Features: Tensor Query Language</h3>
                <pre className="text-xs md:text-sm overflow-x-auto bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono">
                  {`from tensor_query_language import TQLParser

# Initialize the TQL system
parser = TQLParser(database)

# Example 1: Finding tensors by their properties
result = parser.execute("""
    -- Find all image tensors larger than 224x224
    SELECT * FROM tensors 
    WHERE metadata.type = 'image'
    AND metadata.dimensions[0] >= 224
    AND metadata.dimensions[1] >= 224
""")

# Example 2: Finding recent tensors
result = parser.execute("""
    -- Get tensors created in the last hour
    SELECT * FROM tensors 
    WHERE metadata.created_at > NOW() - INTERVAL '1 hour'
    ORDER BY metadata.created_at DESC
""")

# Example 3: Complex tensor operations
result = parser.execute("""
    -- Decompose a large tensor into smaller factors
    TRANSFORM tensors 
    USING decompose_tucker 
    WHERE id = '12345' 
    WITH rank=[10, 10, 10]  -- Reduce each dimension to size 10
""")

# Example 4: Finding similar tensors
result = parser.execute("""
    -- Find 5 tensors most similar to tensor_id '12345'
    SEARCH tensors 
    USING tensor('12345')
    METRIC 'cosine'  -- Use cosine similarity
    LIMIT 5
""")`}
                </pre>
              </motion.div>
            </TabsContent>

            <TabsContent value="ml" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Machine Learning Pipeline</h3>
                <pre className="text-xs md:text-sm overflow-x-auto bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono">
                  {`# Creating a machine learning pipeline with Tensorus
import numpy as np
from tensor_database import TensorDatabase
from tensor_processor import TensorProcessor
import torch
from torch import nn

# Initialize database and processor
db = TensorDatabase(storage_path="ml_pipeline.h5")
processor = TensorProcessor(use_gpu=True)

# 1. Store training data
def store_training_batch(x_batch, y_batch, batch_id):
    metadata = {
        "type": "training_data",
        "batch_id": batch_id,
        "x_shape": x_batch.shape,
        "y_shape": y_batch.shape,
        "timestamp": datetime.now().isoformat()
    }
    # Store features and labels together
    combined = np.concatenate([x_batch, y_batch], axis=1)
    return db.save(combined, metadata)

# 2. Create a data loader that works with Tensorus
class TensorusDataLoader:
    def __init__(self, db, batch_size=32):
        self.db = db
        self.batch_size = batch_size
        # Get all training data IDs
        self.tensor_ids = db.search(
            "metadata.type = 'training_data'",
            sort_by="metadata.batch_id"
        )
    
    def __iter__(self):
        self.current = 0
        return self
    
    def __next__(self):
        if self.current >= len(self.tensor_ids):
            raise StopIteration
            
        # Get next batch
        tensor_id = self.tensor_ids[self.current]
        data, metadata = self.db.get(tensor_id)
        
        # Split back into features and labels
        x = data[:, :-1]  # All columns except last
        y = data[:, -1]   # Last column
        
        self.current += 1
        return torch.FloatTensor(x), torch.LongTensor(y)

# 3. Training loop with Tensorus
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)

loader = TensorusDataLoader(db, batch_size=32)
optimizer = torch.optim.Adam(model.parameters())
criterion = nn.CrossEntropyLoss()

for epoch in range(10):
    for x_batch, y_batch in loader:
        # Forward pass
        outputs = model(x_batch)
        loss = criterion(outputs, y_batch)
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # Store training metrics
        db.save(
            tensor=np.array([loss.item()]),
            metadata={
                "type": "training_metric",
                "metric": "loss",
                "epoch": epoch,
                "timestamp": datetime.now().isoformat()
            }
        )
`}
                </pre>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
